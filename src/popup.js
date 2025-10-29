/* global PagePilotAI */
const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const langEl = document.getElementById('lang');
const styleEl = document.getElementById('style');
const capsEl = document.getElementById('caps');

function setOutput(text){ outputEl.textContent = text || ''; }
function getText(){ return (inputEl.value || '').trim(); }

async function init() {
  console.info('[PagePilot] popup: init');
  await updateBuiltInsStatus();
}

async function updateBuiltInsStatus() {
  // Detect built-ins in the popup (top-level window). Many APIs are not available in workers.
  const built = await PagePilotAI.detectBuiltIns().catch(() => ({}));
  const flags = [];
  const statuses = [];
  
  if (built.hasSummarizer) flags.push('Summarizer');
  else if (built.summarizerStatus === 'downloading') statuses.push('Summarizer: downloading');
  else if (built.summarizerStatus === 'downloadable') statuses.push('Summarizer: ready to download');
  
  if (built.hasTranslator) flags.push('Translator');
  else if (built.translatorStatus === 'downloading') statuses.push('Translator: downloading');
  else if (built.translatorStatus === 'downloadable') statuses.push('Translator: ready to download');
  
  if (built.hasProofreader) flags.push('Proofreader');
  if (built.hasWriter) flags.push('Writer');
  if (built.hasRewriter) flags.push('Rewriter');
  if (built.hasPrompt) flags.push('Prompt');
  
  const statusLine = flags.length 
    ? `Built-ins: ${flags.join(', ')}` 
    : statuses.length 
      ? `Models: ${statuses.join(', ')}` 
      : 'Built-ins: none (click an action to download if available, or enable fallback)';
  
  capsEl.textContent = statusLine;
  console.info('[PagePilot] popup: capabilities flags', flags, 'statuses', statuses);
}

async function sendBg(msg){
  return new Promise(resolve => chrome.runtime.sendMessage(msg, resolve));
}

async function useSelection(){
  const sel = await sendBg({ type: 'pagepilot.getSelection' });
  if (sel?.ok && sel.data) {
    inputEl.value = sel.data;
  } else {
    setOutput('No selection detected on the active tab.');
  }
}

document.getElementById('useSelection').addEventListener('click', useSelection);
document.getElementById('refreshStatus').addEventListener('click', async () => {
  capsEl.textContent = 'Checking models…';
  await updateBuiltInsStatus();
});

for (const btn of document.querySelectorAll('.actions button')){
  btn.addEventListener('click', async () => {
    console.info('[PagePilot] popup: action click', btn.dataset.act);
    setOutput('Working…');
    const action = btn.dataset.act;
    const text = getText();
    if (!text) return setOutput('Please enter or select some text.');
    try {
      let r;
      const safeLang = (langEl.value || 'en').trim().toLowerCase() || 'en';
      if (action === 'summarize') r = await PagePilotAI.summarize(text);
      else if (action === 'translate') r = await PagePilotAI.translate(text, safeLang);
      else if (action === 'proofread') r = await PagePilotAI.proofread(text);
      else if (action === 'rewrite') r = await PagePilotAI.rewrite(text, (styleEl.value||'').trim() || 'concise');
      else if (action === 'simplify') r = await PagePilotAI.simplify(text, 'grade 6');
      else if (action === 'write') r = await PagePilotAI.write(text);
      else if (action === 'prompt') r = await PagePilotAI.promptStructured(text);
      else r = { ok: false, error: 'Unknown action' };
      console.info('[PagePilot] popup: result ok?', r?.ok, 'source:', r?.meta?.source);
      const tag = r?.meta?.source === 'gemini' ? 'Gemini' : r?.meta?.source === 'builtin' ? 'On-device' : r?.meta?.source === 'stub' ? 'Local' : undefined;
      if (tag) capsEl.textContent = capsEl.textContent.replace(/\s*\|\s*Result:\s*.+$/, '') + ` | Result: ${tag}`;
      setOutput(r.ok ? (typeof r.data === 'string' ? r.data : JSON.stringify(r.data, null, 2)) : r.error);
    } catch (e) {
      setOutput(String(e));
    }
  });
}

init();
