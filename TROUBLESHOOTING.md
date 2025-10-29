# PagePilot Troubleshooting Guide

## Issues with Translator and Rewriter APIs

### Problem
The Translator and Rewriter APIs are falling back to Gemini instead of using built-in models, and they're not showing up in the popup's "Built-ins" status.

### Root Causes

#### 1. **Translator API - Incorrect `availability()` call**
**Issue**: The Translator API requires BOTH `sourceLanguage` and `targetLanguage` parameters.

**Wrong:**
```javascript
await Translator.availability(); // ❌ Missing required params
```

**Correct:**
```javascript
await Translator.availability({ 
  sourceLanguage: 'en', 
  targetLanguage: 'es' 
}); // ✅ Correct
```

**Why it matters**: The Translator API uses language packs downloaded on-demand. Without specifying the language pair, the API can't determine availability.

**Note**: The API does NOT support `'auto'` as a source language. You must specify a valid BCP 47 language code like `'en'`, `'es'`, `'fr'`, etc.

#### 2. **Rewriter API - Requires Origin Trial**
**Issue**: The Rewriter API is in **origin trial** (Chrome 137-148) and requires either:
- An origin trial token in your manifest, OR
- Enabling the flag `chrome://flags/#rewriter-api-for-gemini-nano`

**To fix for local testing:**
1. Go to `chrome://flags/#rewriter-api-for-gemini-nano`
2. Set to **Enabled**
3. **Relaunch Chrome**

**To fix for production:**
1. Go to https://developer.chrome.com/origintrials#/view_trial/444167513249415169
2. Register your extension (use `chrome-extension://YOUR_EXTENSION_ID`)
3. Copy the trial token
4. Add to `manifest.json`:
```json
{
  "trial_tokens": ["YOUR_TOKEN_HERE"]
}
```

#### 3. **Rewriter API - Invalid `tone` values**
**Issue**: The Rewriter API only accepts specific tone values.

**Valid tones:**
- `'more-formal'`
- `'as-is'` (default)
- `'more-casual'`

**Wrong:**
```javascript
await Rewriter.create({ tone: 'neutral' }); // ❌ 'neutral' is not valid
await Rewriter.create({ tone: 'friendly' }); // ❌ 'friendly' is not valid
```

**Correct:**
```javascript
await Rewriter.create({ tone: 'more-casual' }); // ✅ Valid
await Rewriter.create({ tone: 'more-formal' }); // ✅ Valid
await Rewriter.create({ tone: 'as-is', length: 'shorter' }); // ✅ Use length for conciseness
```

#### 4. **Translator API - Context Restrictions**
**Issue**: The Translator API may not work in service worker context.

**Solution**: Call the Translator in the **MAIN world** (page context) using `chrome.scripting.executeScript`:

```javascript
const [{ result }] = await chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN', // ← Important!
  func: async (text, lang) => {
    if (window.Translator?.create) {
      const t = await window.Translator.create({ 
        sourceLanguage: 'en', 
        targetLanguage: lang 
      });
      const result = await t.translate(text);
      t?.destroy?.();
      return result;
    }
  },
  args: [text, targetLang]
});
```

### Fixes Applied

1. **Updated `detectBuiltIns()` in `aiAdapter.js`**:
   - Added `sourceLanguage` parameter to `Translator.availability()`
   - Changed Writer/Rewriter test from throwing errors to console warnings
   - Added `destroy()` calls to clean up test sessions

2. **Updated `translate()` in `aiAdapter.js`**:
   - Added `sourceLang` parameter (defaults to `'en'`)
   - Properly checks language pair availability before creating translator
   - Calls `destroy()` after translation

3. **Updated `rewrite()` in `aiAdapter.js`**:
   - Maps common style names to valid tone values
   - Uses `length` parameter for 'concise'/'shorter' styles
   - Calls `destroy()` after rewriting

4. **Updated `background.js`**:
   - Translator calls now try multiple source languages (en, es, fr, de, ja)
   - Added proper error handling and logging
   - Calls translator in MAIN world for keyboard shortcuts and context menus

5. **Updated `README.md`**:
   - Added flag requirement for Rewriter API
   - Added note about origin trial for production use

### How to Verify the Fix

1. **Enable the Rewriter flag**:
   ```
   chrome://flags/#rewriter-api-for-gemini-nano
   → Set to Enabled
   → Relaunch Chrome
   ```

2. **Check Translator availability**:
   - Open DevTools on any page
   - Run:
   ```javascript
   await Translator.availability({ sourceLanguage: 'en', targetLanguage: 'es' })
   // Should return 'available' or 'downloadable'
   ```

3. **Check Rewriter availability**:
   - Open DevTools on any page
   - Run:
   ```javascript
   await Rewriter.availability()
   // Should return 'available' or 'downloadable'
   ```

4. **Test in the extension**:
   - Reload the extension
   - Click the PagePilot icon
   - Click 🔄 Refresh
   - Should show: `Built-ins: Summarizer, Translator, Rewriter, Writer, Proofreader`

5. **Test translation**:
   - Select text on a webpage
   - Press Alt+T (or right-click → Translate)
   - Overlay should show `Translation • On-device`

6. **Test rewrite**:
   - Select text on a webpage
   - Right-click → Rewrite
   - Enter style: `formal` or `casual` or `concise`
   - Overlay should show `Rewrite • On-device (formal)`

### Expected Console Output

When working correctly, you should see:

**Service Worker Console** (`chrome://extensions` → PagePilot → Service worker):
```
[PagePilot] background: starting
[PagePilot] onInstalled: install
[PagePilot] context menus created
[PagePilot] command: translate
[PagePilot] translate result ok? true source: builtin
```

**Page Console** (DevTools on the webpage):
```
[PagePilot] content: loaded
[PagePilot] content: overlay shown
```

**Popup Console** (Right-click popup → Inspect):
```
[PagePilot] popup: init
[PagePilot] popup: capabilities flags ['Summarizer', 'Translator', 'Writer', 'Rewriter', 'Proofreader']
```

### Common Errors and Solutions

#### Error: "Translator is not defined"
- **Cause**: Translator API not available on your Chrome version
- **Solution**: Update Chrome to 138+ or enable Gemini fallback

#### Error: "availability is not a function"
- **Cause**: API not exposed (missing flag or origin trial)
- **Solution**: Enable the Rewriter flag or add origin trial token

#### Error: "Invalid tone value"
- **Cause**: Using invalid tone like 'neutral' or 'friendly'
- **Solution**: Use 'more-formal', 'as-is', or 'more-casual'

#### Error: "Language pair not supported"
- **Cause**: The requested language pair hasn't been downloaded
- **Solution**: Wait for download or try a different language pair

### Language Support

The Translator API supports these common language pairs (download required):
- English ↔️ Spanish (en ↔️ es)
- English ↔️ French (en ↔️ fr)
- English ↔️ German (en ↔️ de)
- English ↔️ Japanese (en ↔️ ja)
- And many more...

**Note**: Not all language pairs are available. The API will return `'unavailable'` for unsupported pairs.

### Additional Resources

- **Translator API Docs**: https://developer.chrome.com/docs/ai/translator-api
- **Rewriter API Docs**: https://developer.chrome.com/docs/ai/rewriter-api
- **Origin Trial Registration**: https://developer.chrome.com/origintrials#/view_trial/444167513249415169
- **Model Status Page**: `chrome://on-device-internals`

### Need More Help?

1. Check the Service Worker console for errors
2. Verify model download status at `chrome://on-device-internals`
3. Try enabling Gemini fallback in Options as a workaround
4. File an issue on GitHub with console logs and Chrome version

---

**Last Updated**: October 27, 2025
