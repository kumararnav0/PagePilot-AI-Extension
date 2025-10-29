// PagePilot AI Adapter
// Feature-detects Chrome built-in AI APIs (Early Preview) and falls back to Gemini or local stubs.
// Contract: All methods return a Promise<{ ok: boolean, data?: any, error?: string, meta?: { source: 'builtin'|'gemini'|'stub' } }>.

(function(global){
  const DEFAULT_MODEL = 'gemini-2.5-pro';

  // Read settings from chrome.storage (extension) or localStorage (web), with safe defaults.
  async function getSettings() {
    const defaults = {
      useCloudFallback: false,
      geminiApiKey: '',
      geminiModel: DEFAULT_MODEL,
      defaultTargetLang: 'en',
      maxSummarySentences: 3
    };
    try {
      if (global.chrome?.storage?.sync) {
        const data = await new Promise(resolve => chrome.storage.sync.get(defaults, resolve));
        return { ...defaults, ...data };
      }
    } catch(_) {}
    // Fallback to localStorage for non-extension contexts
    try {
      const raw = global.localStorage?.getItem('pagepilot_settings');
      if (raw) return { ...defaults, ...JSON.parse(raw) };
    } catch(_) {}
    return defaults;
  }

  function setSettingsPartial(patch) {
    // Used in options.js; here for completeness
    if (global.chrome?.storage?.sync) {
      chrome.storage.sync.set(patch);
    } else if (global.localStorage) {
      const cur = JSON.parse(global.localStorage.getItem('pagepilot_settings')||'{}');
      global.localStorage.setItem('pagepilot_settings', JSON.stringify({ ...cur, ...patch }));
    }
  }

  // --- Built-in API detection (correct Chrome AI API shape per official docs) ---
  async function detectBuiltIns() {
    // Chrome's built-in API APIs are top-level globals: Translator, Summarizer, Writer, Rewriter, LanguageModel
    // https://developer.chrome.com/docs/ai/translator-api
    // https://developer.chrome.com/docs/ai/summarizer-api
    // https://developer.chrome.com/docs/ai/writer-api
    const settings = await getSettings().catch(() => ({ defaultTargetLang: 'en' }));

    // Translator availability check: try without params first, then common language pairs
    let translatorStatus = 'unavailable';
    if (global.Translator) {
      try {
        // Try checking availability without language params (some Chrome versions support this)
        translatorStatus = await global.Translator.availability();
      } catch (e) {
        // If that fails, check if the API exists at all (means it's available, just needs language params)
        if (typeof global.Translator.create === 'function') {
          // Translator API exists, mark as available - actual language pair check happens at runtime
          translatorStatus = 'available';
        } else {
          translatorStatus = 'unavailable';
        }
      }
    }

    const checks = await Promise.allSettled([
      global.LanguageModel?.availability?.().catch(() => 'unavailable'),        // Prompt API (EPP)
      global.Summarizer?.availability?.().catch(() => 'unavailable'),           // Summarizer (stable)
      global.Writer?.availability?.().catch(() => 'unavailable'),               // Writer (origin trial)
      global.Rewriter?.availability?.().catch(() => 'unavailable'),             // Rewriter (origin trial)
      global.Writer?.availability?.().catch(() => 'unavailable')                // Proofreader uses Writer API
    ]);

    let [promptStatus, summarizerStatus, writerStatus, rewriterStatus, proofreaderStatus] =
      checks.map(r => r.status === 'fulfilled' ? r.value : 'unavailable');

    // Debug logging
    console.info('[PagePilot] detectBuiltIns statuses:', {
      promptStatus, summarizerStatus, translatorStatus, writerStatus, rewriterStatus, proofreaderStatus
    });

    // Check if APIs are usable (available OR downloadable)
    // Don't test create() in detection as it can trigger downloads or fail on first call
    const isUsable = (status) => status === 'available' || status === 'downloadable' || status === 'downloading';

    const result = {
      hasPrompt: isUsable(promptStatus),
      hasSummarizer: isUsable(summarizerStatus),
      hasTranslator: isUsable(translatorStatus),
      hasWriter: isUsable(writerStatus),
      hasRewriter: isUsable(rewriterStatus),
      hasProofreader: isUsable(writerStatus), // Proofreader uses Writer API
      promptStatus,
      summarizerStatus,
      translatorStatus,
      writerStatus,
      rewriterStatus,
      proofreaderStatus: writerStatus // Proofreader status = Writer status
    };
    
    console.info('[PagePilot] detectBuiltIns result:', result);
    return result;
  }

  // --- Cloud Fallback (Gemini) ---
  async function callGemini({ model, apiKey, system, input }) {
    if (!apiKey) return { ok: false, error: 'Missing Gemini API key' };
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const body = {
        contents: [
          ...(system ? [{ role: 'user', parts: [{ text: system }]}] : []),
          { role: 'user', parts: [{ text: input }] }
        ]
      };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) return { ok: false, error: `Gemini HTTP ${res.status}` };
      const json = await res.json();
      const text = json?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || '';
      if (!text) return { ok: false, error: 'Empty response from Gemini' };
      return { ok: true, data: text };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }

  // --- Local stub helpers ---
  function simpleSummary(text, maxSentences = 3) {
    if (!text) return '';
    const sentences = text
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean);
    return sentences.slice(0, maxSentences).join(' ');
  }

  function identity(text){ return text || ''; }

  // --- Core operations ---
  async function summarize(text) {
    const settings = await getSettings();
    const built = await detectBuiltIns();
    // Try built-in summarizer (Chrome 138+, stable)
    // https://developer.chrome.com/docs/ai/summarizer-api
    try {
      if (built.hasSummarizer && global.Summarizer) {
        const summarizer = await global.Summarizer.create({ type: 'key-points', format: 'plain-text', length: 'medium' });
        const result = await summarizer.summarize(text);
        if (result) return { ok: true, data: String(result), meta: { source: 'builtin' } };
      }
    } catch (e) { 
      console.warn('[PagePilot] summarizer built-in failed:', e);
    }
    // Cloud fallback
    if (settings.useCloudFallback) {
      const system = 'Summarize the following text into a concise TL;DR with 3-5 bullet points.';
      const r = await callGemini({ model: settings.geminiModel, apiKey: settings.geminiApiKey, system, input: text });
      if (r.ok) return { ...r, meta: { source: 'gemini' } };
    }
    // Local stub
    return { ok: true, data: simpleSummary(text, settings.maxSummarySentences), meta: { source: 'stub' } };
  }

  async function translate(text, targetLang, sourceLang) {
    const settings = await getSettings();
    const lang = targetLang || settings.defaultTargetLang || 'en';
    const source = sourceLang || 'en'; // Default to English if not specified
    const built = await detectBuiltIns();
    // Try built-in translator (Chrome 138+, stable)
    // https://developer.chrome.com/docs/ai/translator-api
    // Note: Translator requires SPECIFIC sourceLanguage + targetLanguage (no 'auto')
    try {
      if (built.hasTranslator && global.Translator) {
        // Check language pair support first
        const availability = await global.Translator.availability({ 
          sourceLanguage: source, 
          targetLanguage: lang 
        });
        if (availability === 'available' || availability === 'downloadable') {
          const translator = await global.Translator.create({ 
            sourceLanguage: source, 
            targetLanguage: lang 
          });
          const result = await translator.translate(text);
          translator?.destroy?.();
          if (result) return { ok: true, data: String(result), meta: { source: 'builtin' } };
        }
      }
    } catch (e) {
      console.warn('[PagePilot] translator built-in failed:', e);
    }
    if (settings.useCloudFallback) {
      const system = `Translate the text into ${lang}. Respond with only the translation.`;
      const r = await callGemini({ model: settings.geminiModel, apiKey: settings.geminiApiKey, system, input: text });
      if (r.ok) return { ...r, meta: { source: 'gemini' } };
    }
    return { ok: true, data: text, meta: { source: 'stub' } }; // identity if no translation available
  }

  async function proofread(text) {
    const settings = await getSettings();
    const built = await detectBuiltIns();
    // Try built-in Writer API for proofreading (origin trial)
    // https://developer.chrome.com/docs/ai/writer-api
    try {
      if (built.hasWriter && global.Writer) {
        const writer = await global.Writer.create({ tone: 'neutral', format: 'plain-text', sharedContext: 'Proofread and correct grammar and spelling. Preserve meaning and tone. Return only the corrected text with no explanations.' });
        const result = await writer.write(text);
        if (result) return { ok: true, data: String(result), meta: { source: 'builtin' } };
      }
    } catch (e) {
      console.warn('[PagePilot] proofreader built-in failed:', e);
    }
    if (settings.useCloudFallback) {
      const system = 'Proofread and correct grammar and spelling. Preserve meaning and tone. Return only the corrected text, no explanations, no notes.';
      const r = await callGemini({ model: settings.geminiModel, apiKey: settings.geminiApiKey, system, input: text });
      if (r.ok) return { ...r, meta: { source: 'gemini' } };
    }
    return { ok: true, data: text, meta: { source: 'stub' } }; // no-op
  }

  async function rewrite(text, style) {
    const settings = await getSettings();
    const built = await detectBuiltIns();
    // Try built-in Rewriter API (origin trial)
    // https://developer.chrome.com/docs/ai/rewriter-api
    // Valid tones: 'more-formal', 'as-is', 'more-casual'
    try {
      if (built.hasRewriter && global.Rewriter) {
        // Map common styles to valid tone values
        let tone = 'as-is';
        const lowerStyle = (style || '').toLowerCase();
        if (lowerStyle.includes('formal')) tone = 'more-formal';
        else if (lowerStyle.includes('casual') || lowerStyle.includes('friendly')) tone = 'more-casual';
        else if (lowerStyle.includes('concise') || lowerStyle.includes('shorter')) tone = 'as-is'; // use length param instead
        
        const options = { tone, format: 'plain-text' };
        if (lowerStyle.includes('concise') || lowerStyle.includes('shorter')) options.length = 'shorter';
        if (lowerStyle.includes('longer')) options.length = 'longer';
        
        const rewriter = await global.Rewriter.create(options);
        const result = await rewriter.rewrite(text);
        rewriter?.destroy?.();
        if (result) return { ok: true, data: String(result), meta: { source: 'builtin' } };
      }
    } catch (e) {
      console.warn('[PagePilot] rewriter built-in failed:', e);
    }
    if (settings.useCloudFallback) {
      const tone = style || 'clear and concise';
      const system = `Rewrite in a ${tone} style. Return only the rewritten text. No explanations or commentary.`;
      const r = await callGemini({ model: settings.geminiModel, apiKey: settings.geminiApiKey, system, input: text });
      if (r.ok) return { ...r, meta: { source: 'gemini' } };
    }
    return { ok: true, data: text, meta: { source: 'stub' } };
  }

  async function write(prompt) {
    const settings = await getSettings();
    const built = await detectBuiltIns();
    // Try built-in Writer API (origin trial)
    // https://developer.chrome.com/docs/ai/writer-api
    try {
      if (built.hasWriter && global.Writer) {
        const writer = await global.Writer.create({ tone: 'neutral', format: 'plain-text' });
        const result = await writer.write(prompt);
        if (result) return { ok: true, data: String(result), meta: { source: 'builtin' } };
      }
    } catch (e) {
      console.warn('[PagePilot] writer built-in failed:', e);
    }
    if (settings.useCloudFallback) {
      const system = 'Write an original response that is helpful and engaging.';
      const r = await callGemini({ model: settings.geminiModel, apiKey: settings.geminiApiKey, system, input: prompt });
      if (r.ok) return { ...r, meta: { source: 'gemini' } };
    }
    // Minimal local stub
    return { ok: true, data: `Draft: ${prompt}`, meta: { source: 'stub' } };
  }

  async function promptStructured(promptText) {
    const settings = await getSettings();
    const built = await detectBuiltIns();
    // Try built-in LanguageModel/Prompt API (EPP only)
    // https://developer.chrome.com/docs/ai/prompt-api
    try {
      if (built.hasPrompt && global.LanguageModel) {
        const outLang = /^(en|es|ja)$/i.test(settings.defaultTargetLang) ? settings.defaultTargetLang.toLowerCase() : 'en';
        const session = await global.LanguageModel.create({ 
          systemPrompt: 'Respond in JSON only. If not structured, infer a reasonable JSON structure.',
          outputLanguage: outLang
        });
        const result = await session.prompt(promptText);
        if (result) {
          try { return { ok: true, data: JSON.parse(result), meta: { source: 'builtin' } }; }
          catch(_) { return { ok: true, data: result, meta: { source: 'builtin' } }; }
        }
      }
    } catch (e) {
      console.warn('[PagePilot] prompt built-in failed:', e);
    }
    if (settings.useCloudFallback) {
      const system = 'Respond in JSON only. If not structured, infer a reasonable JSON structure.';
      const r = await callGemini({ model: settings.geminiModel, apiKey: settings.geminiApiKey, system, input: promptText });
      if (r.ok) {
        // Try parse JSON; if fails, return text
        try { return { ok: true, data: JSON.parse(r.data), meta: { source: 'gemini' } }; } catch(_) { return { ...r, meta: { source: 'gemini' } }; }
      }
    }
    return { ok: true, data: { text: promptText }, meta: { source: 'stub' } };
  }

  async function simplify(text, readingLevel = 'grade 6') {
    const settings = await getSettings();
    const built = await detectBuiltIns();
    // Use Writer/Rewriter to produce simplified text at a target reading level
    try {
      if (built.hasWriter && global.Writer) {
        const writer = await global.Writer.create({ 
          tone: 'neutral', 
          format: 'plain-text', 
          sharedContext: `Rewrite this text at a ${readingLevel} reading level. Use simple words and short sentences. Preserve all key information. Return only the simplified text, no commentary.` 
        });
        const result = await writer.write(text);
        if (result) return { ok: true, data: String(result), meta: { source: 'builtin' } };
      }
    } catch (e) {
      console.warn('[PagePilot] simplify built-in failed:', e);
    }
    if (settings.useCloudFallback) {
      const system = `Rewrite this text at a ${readingLevel} reading level. Use simple words and short sentences. Preserve all key information. Return only the simplified text.`;
      const r = await callGemini({ model: settings.geminiModel, apiKey: settings.geminiApiKey, system, input: text });
      if (r.ok) return { ...r, meta: { source: 'gemini' } };
    }
    return { ok: true, data: text, meta: { source: 'stub' } };
  }

  function capabilities() {
    // Return sync wrapper; actual detection is async now
    return { detectAsync: detectBuiltIns };
  }

  const adapter = { summarize, translate, proofread, rewrite, write, promptStructured, simplify, capabilities, getSettings, setSettingsPartial, detectBuiltIns };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = adapter;
  } else {
    global.PagePilotAI = adapter;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
