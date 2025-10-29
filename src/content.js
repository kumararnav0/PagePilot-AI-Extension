// PagePilot content script: displays overlay bubbles with results
(function(){
  console.info('[PagePilot] content: loaded');

  function ensureStyles(){
    if (document.getElementById('pagepilot-style')) return;
    const s = document.createElement('style');
    s.id = 'pagepilot-style';
    s.textContent = `
      .pagepilot-overlay{position:absolute; z-index:2147483647; max-width: 400px; background:#111; color:#f5f5f5; border-radius:10px; box-shadow:0 6px 24px rgba(0,0,0,.35); padding:12px 14px; font: 13px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;}
      .pagepilot-overlay h4{margin:0 0 6px 0; font-size:13px; color:#9cd1ff}
      .pagepilot-overlay button{background:#222; color:#ddd; border:1px solid #333; border-radius:8px; padding:4px 8px; margin-top:8px; margin-right:6px; cursor:pointer; font-size:12px;}
      .pagepilot-overlay button:hover{background:#333;}
      .pagepilot-overlay button:active{background:#2a2a2a;}
      .pagepilot-overlay button.primary{background:#2563eb; border-color:#1d4ed8;}
      .pagepilot-overlay button.primary:hover{background:#1d4ed8;}
      .pagepilot-overlay pre{white-space: pre-wrap; margin:0; font-size:12px; line-height:1.5;}
      .pagepilot-bilingual{display:flex; gap:12px; margin-top:6px;}
      .pagepilot-bilingual > div{flex:1; padding:6px; background:#1a1a1a; border-radius:6px;}
      .pagepilot-bilingual h5{margin:0 0 4px 0; font-size:11px; color:#9cd1ff; text-transform:uppercase;}
      .pagepilot-spinner{display:inline-block; width:14px; height:14px; border:2px solid #333; border-top-color:#9cd1ff; border-radius:50%; animation:pagepilot-spin 0.6s linear infinite;}
      @keyframes pagepilot-spin{to{transform:rotate(360deg);}}
    `;
    document.documentElement.appendChild(s);
  }

  function placeNearSelection(el){
    const sel = window.getSelection();
    let x = 20, y = 20;
    if (sel && sel.rangeCount) {
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      x = Math.max(10, rect.left + window.scrollX);
      y = Math.max(10, rect.bottom + window.scrollY + 6);
    }
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  function showOverlay({ title, body, original, isBilingual, action }){
    ensureStyles();
    const el = document.createElement('div');
    el.className = 'pagepilot-overlay';
    
    // Check if this is an error message
    const isError = action === 'error' || (title && title.toLowerCase().includes('error')) || (body && body.includes('Chrome AI'));
    
    if (isError) {
      // Show error with prominent styling and link to options
      el.innerHTML = `
        <h4 style="color: #d32f2f;">⚠️ ${escapeHtml(title || 'Error')}</h4>
        <pre style="background: #ffebee; padding: 12px; border-left: 3px solid #d32f2f;">${escapeHtml(body || '')}</pre>
        <p style="margin-top: 10px; font-size: 12px;">
          💡 <a href="#" id="openOptions" style="color: #1a73e8; text-decoration: underline;">Open Options</a> to configure Gemini fallback for cloud processing.
        </p>
      `;
      
      // Add listener to open options
      setTimeout(() => {
        const optionsLink = el.querySelector('#openOptions');
        if (optionsLink) {
          optionsLink.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.runtime.sendMessage({ type: 'pagepilot.openOptions' });
            el.remove();
          });
        }
      }, 0);
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.addEventListener('click', () => el.remove());
      el.appendChild(closeBtn);
      document.body.appendChild(el);
      return;
    }
    
    // Store selection information BEFORE creating overlay
    const sel = window.getSelection();
    const hasSelection = sel && sel.rangeCount > 0 && !sel.isCollapsed;
    let storedRange = null;
    
    if (hasSelection) {
      try {
        storedRange = sel.getRangeAt(0).cloneRange();
      } catch(e) {
        console.warn('[PagePilot] could not clone range:', e);
      }
    }
    
    if (isBilingual && original) {
      el.innerHTML = `
        <h4>${escapeHtml(title||'PagePilot')}</h4>
        <div class="pagepilot-bilingual">
          <div><h5>Original</h5><pre>${escapeHtml(original)}</pre></div>
          <div><h5>Translated</h5><pre>${escapeHtml(body||'')}</pre></div>
        </div>
      `;
    } else {
      el.innerHTML = `<h4>${escapeHtml(title||'PagePilot')}</h4><pre>${escapeHtml(body||'')}</pre>`;
    }
    
    const btnRow = document.createElement('div');
    
    // Copy button (always show)
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy';
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(body || '');
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
      } catch(e) {
        console.error('[PagePilot] copy failed:', e);
        copyBtn.textContent = '✗ Failed';
      }
    });
    btnRow.appendChild(copyBtn);
    
    // Replace Selection button (only for editable actions: proofread, simplify, rewrite)
    const canReplace = ['proofread', 'simplify', 'rewrite'].includes(action);
    if (canReplace && storedRange && body) {
      const replaceBtn = document.createElement('button');
      replaceBtn.textContent = '↻ Replace Selection';
      replaceBtn.className = 'primary';
      replaceBtn.addEventListener('click', () => {
        try {
          // Check if the range's container is editable
          const container = storedRange.commonAncestorContainer;
          const editableParent = container.nodeType === 3 ? container.parentElement : container;
          const isEditable = editableParent && (
            editableParent.isContentEditable ||
            editableParent.tagName === 'TEXTAREA' ||
            (editableParent.tagName === 'INPUT' && ['text', 'email', 'search', 'url'].includes(editableParent.type)) ||
            editableParent.closest('[contenteditable="true"]') ||
            editableParent.closest('textarea') ||
            editableParent.closest('input[type="text"]')
          );
          
          if (!isEditable) {
            replaceBtn.textContent = '✗ Not editable';
            setTimeout(() => replaceBtn.textContent = '↻ Replace Selection', 2000);
            return;
          }
          
          // Restore selection and replace
          const currentSel = window.getSelection();
          currentSel.removeAllRanges();
          currentSel.addRange(storedRange);
          
          storedRange.deleteContents();
          storedRange.insertNode(document.createTextNode(body));
          
          replaceBtn.textContent = '✓ Replaced!';
          setTimeout(() => el.remove(), 1000);
        } catch(e) {
          console.error('[PagePilot] replace failed:', e);
          replaceBtn.textContent = '✗ Failed';
          setTimeout(() => replaceBtn.textContent = '↻ Replace Selection', 2000);
        }
      });
      btnRow.appendChild(replaceBtn);
    }
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => el.remove());
    btnRow.appendChild(closeBtn);
    
    el.appendChild(btnRow);
    
    document.body.appendChild(el);
    placeNearSelection(el);
    console.info('[PagePilot] content: overlay shown');
    try { chrome.runtime?.sendMessage({ type: 'pagepilot.overlayAck' }); } catch(_) {}
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  // Show loading spinner overlay
  function showLoading(action){
    ensureStyles();
    const el = document.createElement('div');
    el.className = 'pagepilot-overlay';
    el.id = 'pagepilot-loading';
    el.innerHTML = `
      <h4>${escapeHtml(action || 'PagePilot')} <span class="pagepilot-spinner"></span></h4>
      <pre style="color:#98a2b3;">Processing...</pre>
    `;
    document.body.appendChild(el);
    placeNearSelection(el);
    return el;
  }

  // Remove loading overlay
  function hideLoading(){
    const loader = document.getElementById('pagepilot-loading');
    if (loader) loader.remove();
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === 'pagepilot.display') {
      console.info('[PagePilot] content: message display');
      hideLoading(); // Remove any loading spinner
      showOverlay(msg.payload || {});
    }
    if (msg?.type === 'pagepilot.loading') {
      console.info('[PagePilot] content: showing loading');
      showLoading(msg.payload?.action);
    }
  });
})();
