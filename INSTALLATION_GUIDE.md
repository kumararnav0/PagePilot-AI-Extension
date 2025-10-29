# PagePilot - Chrome Built-in AI Setup Guide

## Quick Setup Checklist

Follow these steps to enable all Chrome Built-in AI APIs on your device:

### ✅ Step 1: Check Hardware Requirements

**Minimum Requirements:**
- **OS**: Windows 10/11, macOS 13+, Linux, or ChromeOS (Chromebook Plus)
- **Storage**: At least 22 GB free space (for Gemini Nano model download)
- **GPU**: Strictly more than 4 GB VRAM, OR
- **CPU**: 16 GB RAM + 4 CPU cores
- **Network**: Unmetered connection (Wi-Fi or Ethernet, not cellular)

**Check your system:**
1. Visit `chrome://on-device-internals`
2. Check the **Model Status** tab
3. Look for any hardware warnings

---

### ✅ Step 2: Enable Chrome Flags

**Enable the main flag for Prompt API:**

1. Open a new tab and go to: `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`
2. Set dropdown to **Enabled**
3. Click **Relaunch** button

**Enable the flag for Writer/Rewriter APIs (REQUIRED):**

1. Open a new tab and go to: `chrome://flags/#rewriter-api-for-gemini-nano`
2. Set dropdown to **Enabled**
3. Click **Relaunch** button

**Optional - Enable Writer API flag (alternative):**

1. Open a new tab and go to: `chrome://flags/#writer-api-for-gemini-nano`
2. Set dropdown to **Enabled**
3. Click **Relaunch** button

---

### ✅ Step 3: Verify Model Download

After enabling flags and restarting Chrome:

1. Visit `chrome://on-device-internals`
2. Click the **Model Status** tab
3. You should see:
   - **Gemini Nano**: "Ready" or "Downloading" (wait if downloading)
   - Model size: ~22 GB (varies by version)

**If model is downloading:**
- The download can take 5-30 minutes depending on your internet speed
- Keep Chrome open (don't close all windows)
- You can check progress on the Model Status page

**If model doesn't start downloading:**
1. Make sure you have 22+ GB free space
2. Make sure you're on an unmetered connection (not cellular)
3. Try visiting a website that uses the APIs (this can trigger download)

---

### ✅ Step 4: Test in DevTools Console

Open any webpage (e.g., google.com), then:

1. Press **F12** to open DevTools
2. Go to the **Console** tab
3. Run these commands:

**Test Prompt API (Gemini Nano):**
```javascript
await LanguageModel.availability()
// Expected: "available" or "downloadable" or "downloading"
```

**Test Summarizer API:**
```javascript
await Summarizer.availability()
// Expected: "available" or "downloadable"
```

**Test Translator API:**
```javascript
await Translator.availability({ sourceLanguage: 'en', targetLanguage: 'es' })
// Expected: "available" or "downloadable"
```

**Test Writer API:**
```javascript
await Writer.availability()
// Expected: "available" or "downloadable" (after enabling flag)
```

**Test Rewriter API:**
```javascript
await Rewriter.availability()
// Expected: "available" or "downloadable" (after enabling flag)
```

**If you get "unavailable":**
- Check that flags are enabled (Step 2)
- Check hardware requirements (Step 1)
- Wait for model to finish downloading (Step 3)
- Try restarting Chrome completely

---

### ✅ Step 5: Load the PagePilot Extension

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Navigate to `e:\google\pagepilot-ai-extension` and select the folder
5. The extension should now appear in your extensions list
6. **Pin the extension**: Click the puzzle icon in toolbar, then pin PagePilot

---

### ✅ Step 6: Verify Built-in APIs in PagePilot

1. Click the **PagePilot** icon in your toolbar
2. Look at the status line at the bottom
3. Click the **🔄 Refresh** button
4. You should see: `Built-ins: Summarizer, Translator, Writer, Rewriter, Proofreader`

**If you see "Built-ins: none":**
- Make sure all flags are enabled (Step 2)
- Make sure model finished downloading (Step 3)
- Try reloading the extension:
  - Go to `chrome://extensions`
  - Click the refresh icon on PagePilot
  - Open popup again and click 🔄 Refresh

---

### ✅ Step 7: Test the Extension

**Test Summarize (On-device):**
1. Open a news article (e.g., Wikipedia)
2. Select a paragraph of text
3. Press **Alt+S** (or right-click → PagePilot: Summarize Selection)
4. An overlay should appear with: `Summary • On-device`

**Test Translate (On-device):**
1. Select some English text
2. Press **Alt+T** (or right-click → PagePilot: Translate Selection)
3. Enter target language: `es` (Spanish)
4. An overlay should appear with: `Translation • On-device (es)`
5. You should see side-by-side original and translated text

**Test Proofread (On-device):**
1. Open a webpage with a textarea (Gmail, Reddit, etc.)
2. Type: "this are a test sentense with erors"
3. Select the text
4. Press **Alt+P** (or right-click → PagePilot: Proofread Selection)
5. An overlay should appear with: `Proofread • On-device`
6. You should see corrected text: "This is a test sentence with errors"

**Test Simplify (On-device):**
1. Select complex academic or technical text
2. Press **Alt+R** (or right-click → PagePilot: Simplify Reading Level)
3. An overlay should appear with: `Simplified • On-device`
4. You should see text rewritten at grade 6 reading level

**Test Offline (Proof of On-device AI):**
1. Open a news article
2. Select a paragraph
3. Press **Alt+S** → overlay shows summary
4. **Turn on Airplane Mode** (or disconnect Wi-Fi)
5. Select a different paragraph
6. Press **Alt+S** again
7. Overlay should STILL appear with summary (proves on-device!)
8. Turn off Airplane Mode

---

### ✅ Step 8: Setup Gemini Fallback (Optional)

If you want a fallback for when built-in APIs aren't available:

1. Get a Gemini API key:
   - Visit https://aistudio.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the key

2. Open PagePilot popup
3. Click **Settings** (or Options)
4. Check **Use Gemini Fallback**
5. Paste your API key
6. Set model to: `gemini-2.5-pro`
7. Set default target language: `en`
8. Click **Save**

**Note**: When using Gemini fallback, overlays will show `• Gemini` instead of `• On-device`.

---

## Troubleshooting

### Model won't download
- **Check storage**: Need 22+ GB free
- **Check connection**: Must be unmetered (Wi-Fi/Ethernet)
- **Wait**: Downloads can take 5-30 minutes
- **Restart Chrome**: Close all windows and reopen

### APIs show "unavailable"
- **Enable all flags**: Both Prompt API and Rewriter API flags
- **Check hardware**: Need 4+ GB VRAM or 16+ GB RAM
- **Wait for download**: Visit `chrome://on-device-internals` to check status

### Extension shows "Built-ins: none"
- **Reload extension**: `chrome://extensions` → click refresh on PagePilot
- **Check flags**: Make sure both flags are enabled
- **Verify in Console**: Open DevTools and test APIs (Step 4)

### Translator/Rewriter not working
- **Enable Rewriter flag**: `chrome://flags/#rewriter-api-for-gemini-nano`
- **Restart Chrome**: Must relaunch after enabling flag
- **Check origin trial**: For production, you need an origin trial token

### Overlays show "Gemini" instead of "On-device"
- **This means**: Built-in APIs aren't available, using cloud fallback
- **Fix**: Check flags, model download, and hardware requirements
- **Alternative**: This is fine for demo purposes if you have Gemini API key set up

### Model deleted after download
- **Cause**: Chrome deletes model if free space falls below 10 GB
- **Fix**: Free up more disk space (need 22+ GB free)
- **Redownload**: Model will automatically redownload when space is available

---

## API Status Reference

### Stable (Chrome 138+)
- ✅ **Summarizer API**: Works immediately
- ✅ **Translator API**: Works immediately
- ✅ **Language Detector API**: Works immediately (not used in PagePilot)

### Origin Trial (Chrome 137-148)
- ⚠️ **Writer API**: Requires origin trial token OR flag for localhost
- ⚠️ **Rewriter API**: Requires origin trial token OR flag for localhost
- ⚠️ **Proofreader API**: Uses Writer API, same requirements

### Early Preview Program (EPP)
- 🔬 **Prompt API**: Available with EPP signup or flag for localhost

**For localhost testing**: Just enable the flags (no origin trial needed)  
**For production/public use**: Register for origin trials at https://developer.chrome.com/origintrials

---

## Origin Trial Setup (For Production)

If you want to deploy PagePilot publicly or use it on non-localhost domains:

### 1. Register for Writer/Rewriter Origin Trial

1. Visit: https://developer.chrome.com/origintrials#/view_trial/444167513249415169
2. Click **Register**
3. Fill out the form:
   - **Web origin**: For extension, use `chrome-extension://YOUR_EXTENSION_ID`
   - To find your extension ID: Go to `chrome://extensions`, copy the ID under PagePilot
4. Click **Register**
5. Copy the trial token provided

### 2. Add Token to Extension Manifest

Open `manifest.json` and add:

```json
{
  "manifest_version": 3,
  "name": "PagePilot",
  "trial_tokens": [
    "YOUR_ORIGIN_TRIAL_TOKEN_HERE"
  ],
  ...rest of manifest
}
```

### 3. Reload Extension

1. Go to `chrome://extensions`
2. Click refresh icon on PagePilot
3. Test that Writer/Rewriter APIs work without flags

**Note**: Origin trial tokens expire when the trial ends (Chrome 148). You'll need to renew or migrate to stable API.

---

## Expected Model Sizes

| Model | Size | Purpose |
|-------|------|---------|
| **Gemini Nano** | ~22 GB | Powers Prompt, Summarizer, Writer, Rewriter, Proofreader APIs |
| **Translator (per language pair)** | ~50-200 MB | Powers Translator API |
| **Language Detector** | ~5 MB | Powers Language Detector API |

**Total**: Approximately 22-23 GB for full functionality

---

## Quick Reference: Chrome URLs

| URL | Purpose |
|-----|---------|
| `chrome://flags` | Enable experimental features |
| `chrome://on-device-internals` | Check model download status |
| `chrome://extensions` | Manage extensions |
| `chrome://version` | Check Chrome version |

---

## Quick Reference: Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Alt+S** | Summarize selection |
| **Alt+T** | Translate selection |
| **Alt+P** | Proofread selection |
| **Alt+R** | Simplify reading level |

---

## Success Checklist

Before recording your demo video, verify:

- [ ] All flags enabled and Chrome restarted
- [ ] Model shows "Ready" at `chrome://on-device-internals`
- [ ] All APIs return "available" in DevTools console
- [ ] Extension popup shows "Built-ins: Summarizer, Translator, Writer, Rewriter, Proofreader"
- [ ] Summarize works offline (airplane mode test)
- [ ] Translate shows bilingual side-by-side overlay
- [ ] All overlays show "• On-device" tag
- [ ] Keyboard shortcuts (Alt+S, Alt+T, Alt+P, Alt+R) work

---

## Support Resources

- **Chrome Built-in AI Docs**: https://developer.chrome.com/docs/ai/built-in
- **Get Started Guide**: https://developer.chrome.com/docs/ai/get-started
- **API Status Overview**: https://developer.chrome.com/docs/ai/built-in-apis
- **Join Early Preview Program**: https://developer.chrome.com/docs/ai/join-epp
- **Report Issues**: https://issues.chromium.org/issues/new?component=1583300

---

**Last Updated**: October 27, 2025  
**Chrome Version**: 138+ (with origin trials for Writer/Rewriter)
