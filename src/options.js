/* global PagePilotAI */
async function load(){
  const s = await PagePilotAI.getSettings();
  document.getElementById('useCloudFallback').checked = !!s.useCloudFallback;
  document.getElementById('geminiApiKey').value = s.geminiApiKey || '';
  document.getElementById('geminiModel').value = s.geminiModel || 'gemini-1.5-flash';
  document.getElementById('defaultTargetLang').value = s.defaultTargetLang || 'en';
  document.getElementById('maxSummarySentences').value = String(s.maxSummarySentences || 3);
}

async function save(){
  const patch = {
    useCloudFallback: document.getElementById('useCloudFallback').checked,
    geminiApiKey: document.getElementById('geminiApiKey').value.trim(),
    geminiModel: document.getElementById('geminiModel').value.trim(),
    defaultTargetLang: document.getElementById('defaultTargetLang').value.trim(),
    maxSummarySentences: parseInt(document.getElementById('maxSummarySentences').value, 10) || 3
  };
  PagePilotAI.setSettingsPartial(patch);
  const st = document.getElementById('status');
  st.textContent = 'Saved';
  setTimeout(() => st.textContent = '', 1200);
}

document.getElementById('save').addEventListener('click', save);
load();
