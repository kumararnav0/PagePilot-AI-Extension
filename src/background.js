// PagePilot background service worker
// - Creates context menus
// - Coordinates content script and AI adapter
// - Adds diagnostic logging

self.importScripts('aiAdapter.js');
console.info('[PagePilot] background: starting');

// Global error visibility
self.addEventListener('error', (e) => {
  console.error('[PagePilot] background error:', e.message || e);
});
self.addEventListener('unhandledrejection', (e) => {
  console.error('[PagePilot] background unhandled rejection:', e.reason);
});

chrome.runtime.onInstalled.addListener((details) => {
  console.info('[PagePilot] onInstalled:', details?.reason);
  try {
    chrome.contextMenus.create({ id: 'pp_summarize', title: 'PagePilot: Summarize Selection', contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'pp_translate', title: 'PagePilot: Translate Selection…', contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'pp_rewrite', title: 'PagePilot: Rewrite Selection…', contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'pp_proofread', title: 'PagePilot: Proofread Selection', contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'pp_simplify', title: 'PagePilot: Simplify Reading Level', contexts: ['selection'] });
    console.info('[PagePilot] context menus created');
  } catch (e) {
    console.error('[PagePilot] context menu creation failed:', e);
  }
});

chrome.runtime.onStartup?.addListener(() => {
  console.info('[PagePilot] onStartup');
});

chrome.commands.onCommand.addListener(async (command) => {
  console.info('[PagePilot] command:', command);
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    const tabId = tab.id;
    const text = await getSelectionText(tabId);
    if (!text) return showOverlay(tabId, { title: 'No selection', body: 'Select some text first.', action: 'error' });

    let r, tag;
    if (command === 'summarize') {
      await showLoading(tabId, 'Summarizing');
      r = await PagePilotAI.summarize(text);
      tag = r?.meta?.source === 'gemini' ? 'Gemini' : r?.meta?.source === 'builtin' ? 'On-device' : 'Local';
      return showOverlay(tabId, { title: `Summary • ${tag}`, body: r.ok ? r.data : r.error, action: 'summarize' });
    } else if (command === 'translate') {
      const settings = await PagePilotAI.getSettings();
      await showLoading(tabId, 'Translating');
      // Try built-in Translator in page context (MAIN world)
      // Translator API requires SPECIFIC sourceLanguage + targetLanguage (no 'auto')
      const [{ result: pageRes }] = await chrome.scripting.executeScript({
        target: { tabId },
        world: 'MAIN',
        func: async (text, lang) => {
          try {
            if (window.Translator?.create) {
              // Try common source languages: en, es, fr, de, ja
              const sourceLangs = ['en', 'es', 'fr', 'de', 'ja'];
              for (const srcLang of sourceLangs) {
                try {
                  const avail = await window.Translator.availability({ sourceLanguage: srcLang, targetLanguage: lang });
                  if (avail === 'available' || avail === 'downloadable') {
                    const t = await window.Translator.create({ sourceLanguage: srcLang, targetLanguage: lang });
                    const out = await t.translate(text);
                    t?.destroy?.();
                    return { ok: true, data: String(out), meta: { source: 'builtin' } };
                  }
                } catch (e) {
                  continue; // Try next language pair
                }
              }
            }
          } catch (e) {
            console.warn('[PagePilot] Translator in MAIN world failed:', e);
            return { ok: false, error: String(e) };
          }
          return null;
        },
        args: [text, settings.defaultTargetLang || 'en']
      });
      if (pageRes && pageRes.ok) {
        return showOverlay(tabId, { title: `Translation • On-device`, body: pageRes.data, original: text, isBilingual: true, action: 'translate' });
      }
      r = await PagePilotAI.translate(text, settings.defaultTargetLang, 'en');
      tag = r?.meta?.source === 'gemini' ? 'Gemini' : r?.meta?.source === 'builtin' ? 'On-device' : 'Local';
      return showOverlay(tabId, { title: `Translation • ${tag}`, body: r.ok ? r.data : r.error, original: text, isBilingual: true, action: 'translate' });
    } else if (command === 'proofread') {
      await showLoading(tabId, 'Proofreading');
      r = await PagePilotAI.proofread(text);
      tag = r?.meta?.source === 'gemini' ? 'Gemini' : r?.meta?.source === 'builtin' ? 'On-device' : 'Local';
      return showOverlay(tabId, { title: `Proofread • ${tag}`, body: r.ok ? r.data : r.error, action: 'proofread' });
    } else if (command === 'simplify') {
      await showLoading(tabId, 'Simplifying');
      r = await PagePilotAI.simplify(text, 'grade 6');
      tag = r?.meta?.source === 'gemini' ? 'Gemini' : r?.meta?.source === 'builtin' ? 'On-device' : 'Local';
      return showOverlay(tabId, { title: `Simplified • ${tag}`, body: r.ok ? r.data : r.error, action: 'simplify' });
    }
  } catch (e) {
    console.error('[PagePilot] command failed:', e);
  }
});

async function getSelectionText(tabId) {
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => window.getSelection()?.toString() || ''
    });
    return result || '';
  } catch (e) {
    return '';
  }
}

async function showLoading(tabId, action) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'pagepilot.loading', payload: { action } });
  } catch (_) {
    // content script may not be ready; try to inject first
    try {
      await chrome.scripting.executeScript({ target: { tabId }, files: ['src/content.js'] });
      await chrome.tabs.sendMessage(tabId, { type: 'pagepilot.loading', payload: { action } });
    } catch (e) {
      console.warn('[PagePilot] loading indicator failed:', e);
    }
  }
}

async function showOverlay(tabId, payload) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'pagepilot.display', payload });
  } catch (_) {
    // content script may not be ready; try to inject and retry once
    try {
      await chrome.scripting.executeScript({ target: { tabId }, files: ['src/content.js'] });
      await chrome.tabs.sendMessage(tabId, { type: 'pagepilot.display', payload });
    } catch (e) {
      console.warn('[PagePilot] overlay failed:', e);
    }
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.info('[PagePilot] contextMenus.onClicked:', info?.menuItemId);
  if (!tab?.id) return;
  const tabId = tab.id;
  const text = await getSelectionText(tabId);
  if (!text) return showOverlay(tabId, { title: 'No selection', body: 'Select some text first.', action: 'error' });

  if (info.menuItemId === 'pp_summarize') {
    console.info('[PagePilot] summarize: selection length', text?.length || 0);
    await showLoading(tabId, 'Summarizing');
    const r = await PagePilotAI.summarize(text);
    console.info('[PagePilot] summarize result ok?', r.ok, 'source:', r?.meta?.source);
    const tag = r?.meta?.source === 'gemini' ? 'Gemini' : r?.meta?.source === 'builtin' ? 'On-device' : 'Local';
    return showOverlay(tabId, { title: `Summary • ${tag}` , body: r.ok ? r.data : r.error, action: 'summarize' });
  }
  if (info.menuItemId === 'pp_proofread') {
    console.info('[PagePilot] proofread: selection length', text?.length || 0);
    await showLoading(tabId, 'Proofreading');
    const r = await PagePilotAI.proofread(text);
    console.info('[PagePilot] proofread result ok?', r.ok, 'source:', r?.meta?.source);
    const tag = r?.meta?.source === 'gemini' ? 'Gemini' : r?.meta?.source === 'builtin' ? 'On-device' : 'Local';
    return showOverlay(tabId, { title: `Proofread • ${tag}`, body: r.ok ? r.data : r.error, action: 'proofread' });
  }
  if (info.menuItemId === 'pp_rewrite') {
    const [{ result: style }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => window.prompt('Rewrite style (e.g., friendly, formal, concise):', 'concise')
    });
    await showLoading(tabId, 'Rewriting');
    const r = await PagePilotAI.rewrite(text, style || 'concise');
    console.info('[PagePilot] rewrite result ok?', r.ok, 'source:', r?.meta?.source);
    const tag = r?.meta?.source === 'gemini' ? 'Gemini' : r?.meta?.source === 'builtin' ? 'On-device' : 'Local';
    return showOverlay(tabId, { title: `Rewrite • ${tag} (${style||'concise'})`, body: r.ok ? r.data : r.error, action: 'rewrite' });
  }
  if (info.menuItemId === 'pp_simplify') {
    console.info('[PagePilot] simplify: selection length', text?.length || 0);
    await showLoading(tabId, 'Simplifying');
    const r = await PagePilotAI.simplify(text, 'grade 6');
    console.info('[PagePilot] simplify result ok?', r.ok, 'source:', r?.meta?.source);
    const tag = r?.meta?.source === 'gemini' ? 'Gemini' : r?.meta?.source === 'builtin' ? 'On-device' : 'Local';
    return showOverlay(tabId, { title: `Simplified • ${tag}`, body: r.ok ? r.data : r.error, action: 'simplify' });
  }
  if (info.menuItemId === 'pp_translate') {
    const [{ result: lang }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => window.prompt('Translate to language code (e.g., en, es, fr, de, ja):', 'en')
    });
    const target = lang || 'en';
    await showLoading(tabId, 'Translating');
    // Try built-in in page context first (MAIN world)
    // Translator API requires SPECIFIC sourceLanguage + targetLanguage (no 'auto')
    const [{ result: pageRes }] = await chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      func: async (text, lang) => {
        try {
          if (window.Translator?.create) {
            // Try common source languages: en, es, fr, de, ja
            const sourceLangs = ['en', 'es', 'fr', 'de', 'ja'];
            for (const srcLang of sourceLangs) {
              try {
                const avail = await window.Translator.availability({ sourceLanguage: srcLang, targetLanguage: lang });
                if (avail === 'available' || avail === 'downloadable') {
                  const t = await window.Translator.create({ sourceLanguage: srcLang, targetLanguage: lang });
                  const out = await t.translate(text);
                  t?.destroy?.();
                  return { ok: true, data: String(out), meta: { source: 'builtin' } };
                }
              } catch (e) {
                continue; // Try next language pair
              }
            }
          }
        } catch (e) {
          console.warn('[PagePilot] Translator in MAIN world failed:', e);
          return { ok: false, error: String(e) };
        }
        return null;
      },
      args: [text, target]
    });
    if (pageRes && pageRes.ok) {
      return showOverlay(tabId, { title: `Translation • On-device (${target})`, body: pageRes.data, original: text, isBilingual: true, action: 'translate' });
    }
    const r = await PagePilotAI.translate(text, target, 'en');
    console.info('[PagePilot] translate result ok?', r.ok, 'source:', r?.meta?.source);
    const tag = r?.meta?.source === 'gemini' ? 'Gemini' : r?.meta?.source === 'builtin' ? 'On-device' : 'Local';
    return showOverlay(tabId, { title: `Translation • ${tag} (${target})`, body: r.ok ? r.data : r.error, original: text, isBilingual: true, action: 'translate' });
  }
});

// Messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.info('[PagePilot] onMessage:', msg?.type);
  (async () => {
    try {
      if (msg?.type === 'pagepilot.popupAction') {
        const { action, text, opts } = msg;
        let r;
        if (action === 'summarize') r = await PagePilotAI.summarize(text);
        else if (action === 'translate') r = await PagePilotAI.translate(text, opts?.lang);
        else if (action === 'proofread') r = await PagePilotAI.proofread(text);
        else if (action === 'rewrite') r = await PagePilotAI.rewrite(text, opts?.style);
        else if (action === 'write') r = await PagePilotAI.write(text);
        else if (action === 'prompt') r = await PagePilotAI.promptStructured(text);
        else if (action === 'simplify') r = await PagePilotAI.simplify(text, opts?.readingLevel || 'grade 6');
        else r = { ok: false, error: 'Unknown action' };
        sendResponse(r);
      }
      if (msg?.type === 'pagepilot.overlayAck') {
        console.info('[PagePilot] overlay acknowledged by content script');
        return; // no response needed
      }
      if (msg?.type === 'pagepilot.getCapabilities') {
        const caps = await PagePilotAI.detectBuiltIns();
        console.info('[PagePilot] capabilities:', caps);
        sendResponse({ builtIns: caps });
      }
      if (msg?.type === 'pagepilot.getSelection') {
        let tabId = sender?.tab?.id;
        if (!tabId) {
          try {
            const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
            tabId = active?.id;
          } catch (e) {
            console.warn('[PagePilot] getSelection: tabs.query failed', e);
          }
        }
        if (!tabId) return sendResponse({ ok: false, error: 'No active tab' });
        const sel = await getSelectionText(tabId);
        console.info('[PagePilot] getSelection: length', sel?.length || 0);
        sendResponse({ ok: true, data: sel });
      }
    } catch (e) {
      sendResponse({ ok: false, error: String(e) });
    }
  })();
  return true; // async
});
