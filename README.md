# PagePilot – Chrome Built‑in AI Sidekick# PagePilot – Chrome Built‑in AI Sidekick



**Turn any webpage into an AI-powered workspace.** Privacy-first reading and writing tools that run on your device using Chrome's built-in AI (Gemini Nano), with optional Gemini cloud fallback.Privacy‑first reading and writing tools that run on your device using Chrome’s built‑in AI (Gemini Nano), with an optional Gemini cloud fallback for universal demos.



## 🎯 Why This MattersWhy judges will care

- Real on‑device AI: works offline, private by default, visibly tagged as “On‑device.”

- **🔒 Real On-Device AI**: Works offline, private by default, visibly tagged as "On-device"- Useful, not gimmicky: turns any web page into a workspace for summary, translation, proofreading, rewriting, writing, and prompt→JSON.

- **💡 Practical, Not Gimmicky**: 7 essential tools that enhance every webpage- Engineering quality: robust availability detection, graceful fallback, clean UX overlays, and clear troubleshooting.

- **🏗️ Production-Ready**: Robust detection, graceful fallback, polished UX with copy/replace features

What it does

## ✨ Features- Summarizer — TL;DR or outline for selected text

- Translator — translate selection to your language (with bilingual side-by-side view)

**6 Chrome Built-in AI APIs** + Gemini fallback:- Proofreader — fix grammar/clarity

- Rewriter — change tone (formal, friendly, concise)

- **📝 Summarizer** — TL;DR or outline for selected text- Simplify — rewrite at grade 6 reading level

- **🌐 Translator** — Bilingual side-by-side view with 5+ languages- Writer — draft from a prompt

- **✍️ Proofreader** — Fix grammar and clarity- Prompt ➜ JSON — turn prompts into structured data

- **🔄 Rewriter** — Change tone (formal, friendly, concise)

- **📖 Simplify** — Grade 6 reading level conversionAll AI runs locally when built‑ins are available. If not, flip on the optional Gemini fallback in Options.

- **✏️ Writer** — Draft content from prompts

- **🎯 Prompt API** — Structured JSON extraction---



**Enhanced UX:**## Features

- 📋 **Copy Button** — One-click copy to clipboard

- ↻ **Replace Selection** — Edit text in-place for editable fields- Context menu actions over any selection

- ⏳ **Loading States** — Spinner feedback during processing- Popup UI to paste text or grab current selection

- ⌨️ **Keyboard Shortcuts** — Alt+S (Summarize), Alt+T (Translate), Alt+P (Proofread), Alt+R (Simplify)- Keyboard shortcuts (Alt+S Summarize, Alt+T Translate, Alt+P Proofread, Alt+R Simplify)

- 🎨 **Smart Overlays** — Results appear near your selection with source tagging  

- Bilingual side-by-side overlay for translations

---- Model status refresh button in popup

- Options page to enable Gemini fallback and set API/model

## 🚀 Quick Start- Non‑blocking design with progressive enhancement

- Clean overlay near the selection with source tagging: On‑device, Gemini, or Local

### Installation

---

1. Open `chrome://extensions`

2. Enable **Developer mode** (top-right toggle)## How to load and run

3. Click **"Load unpacked"** and select this folder

4. Pin **PagePilot** from the toolbar1) Open chrome://extensions

2) Enable Developer mode

### Enable Built-in AI (Recommended)3) Click “Load unpacked” and select this folder

4) Pin “PagePilot” from the toolbar puzzle menu

**Requirements:**

- Chrome 128+ (Canary/Dev recommended)Optional: If your Chrome build doesn’t expose built‑ins yet, open the Options page and enable Gemini fallback with your API key.

- 22GB free storage (model download)

- 4GB+ VRAM OR 16GB RAM + 4 CPU cores---



**Enable Flags:**## Enable built‑in AI locally (recommended for judges)

1. Navigate to `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`

2. Set to **Enabled** and **Relaunch**1) Hardware readiness

3. Navigate to `chrome://flags/#rewriter-api-for-gemini-nano`  - OS: Windows 10/11, macOS 13+, Linux, or Chromebook Plus

4. Set to **Enabled** and **Relaunch**  - Storage: ~22 GB free (model download)

  - GPU: >4 GB VRAM, or CPU: 16 GB RAM + 4 cores

**Download Model:**

Open DevTools console on any page:2) Enable the flags (if required on your build)

```javascript  - Go to chrome://flags/#prompt-api-for-gemini-nano-multimodal-input

const session = await ai.languageModel.create({  - Set to Enabled and Relaunch

  monitor(m) {  - Go to chrome://flags/#rewriter-api-for-gemini-nano (for Rewriter API)

    m.addEventListener("downloadprogress", e => {  - Set to Enabled and Relaunch

      console.log(`Downloaded ${e.loaded} of ${e.total} bytes`);

    });3) Confirm model status

  }  - Visit chrome://on-device-internals → Model Status

});  - In DevTools on any page, run: await LanguageModel.availability(); // expect "available"

```

4) Reload the extension and try an action. Overlay titles should show "On‑device".

**Verify:**

```javascriptNote: Writer and Rewriter APIs are in origin trial (Chrome 137-148). For production use, sign up at https://developer.chrome.com/origintrials#/view_trial/444167513249415169 and add the token to manifest.json. For local testing, the flag above works.

await ai.languageModel.availability(); // should return "readily"

```---



### Gemini Fallback (Optional)## How it works



If built-in AI isn't available:The adapter in `src/aiAdapter.js` chooses the best engine automatically:

1. Get API key from [Google AI Studio](https://aistudio.google.com/apikey)- Try Chrome built‑ins (LanguageModel, Summarizer, Translator, Writer, Rewriter)

2. Open extension Options page- Fall back to Gemini Developer API if enabled

3. Enable Gemini fallback and paste your API key- As a last resort, run local stubs so the UI still works

4. Overlays will show "• Gemini" instead of "• On-device"

Service worker orchestrates context menus and messaging; the content script renders overlays; the popup shows model status and lets you run tools without selecting text.

---

---

## 🎮 Usage

## Files

### Context Menu (Right-Click)

1. Select text on any webpage- `manifest.json` — MV3 manifest

2. Right-click → **PagePilot: [Action]**- `src/background.js` — context menus + orchestration

3. Results appear in overlay near your selection- `src/content.js` — selection overlays

- `src/aiAdapter.js` — built‑in AI detection + fallbacks

### Keyboard Shortcuts- `src/popup.html|css|js` — popup UI for all tools

- **Alt+S** — Summarize selection- `src/options.html|js` — settings (fallback, API key, model)

- **Alt+T** — Translate selection

- **Alt+P** — Proofread selection---

- **Alt+R** — Simplify reading level

## Demo script (<3 min)

### Popup Interface

Click the PagePilot icon to:1) Hook (10s): Open a news article. Select a paragraph. Press Alt+S (or right-click → Summarize). Show "Summary • On‑device." Toggle airplane mode and repeat to prove it works offline.

- Use tools without selecting text2) Bilingual (30s): Select text and press Alt+T (or Translate). Show side‑by‑side overlay with original and translated text. Mention language learners/accessibility.

- Check model availability status3) Clarity (30s): In a textarea, select a rough paragraph and press Alt+P (Proofread). Copy/paste the improved text. Mention privacy (on‑device).

- Access all 7 AI features4) Simplify (20s): Select complex text, press Alt+R (Simplify). Show grade 6 reading level version in overlay. Copy/paste if needed.

5) Bonus (20s): Prompt➜JSON in popup to extract structured fields from unstructured text (event details). Show the JSON in console.

---6) Close (10s): Click 🔄 Refresh in popup to show live model status; point at source tags; reiterate on‑device privacy + graceful fallback.



## 🏗️ How It WorksTip: If built‑ins aren't available on a judge's machine, enable Gemini fallback. Overlays will show "• Gemini" so reviewers see the path.



**Smart Engine Selection:**---

1. Try Chrome Built-in APIs (on-device, private, fast)

2. Fall back to Gemini API if enabled (cloud, universal)## Troubleshooting

3. Local stubs as last resort (UI always works)

- No built‑ins detected: Normal on some Chrome versions/devices. Use Gemini fallback or ensure hardware/flag requirements.

**Architecture:**- Model shows “downloading”: Wait a few minutes, then reload the extension.

- `src/aiAdapter.js` — Detects availability, handles fallbacks- Empty Gemini response: Check API key, model (gemini‑1.5‑flash is fast), and network.

- `src/background.js` — Orchestrates context menus and commands- Overlays not showing: Some pages block content scripts. Try a regular https article. Check the Service Worker console for warnings.

- `src/content.js` — Renders overlays with copy/replace buttons

- `src/popup.js` — Popup UI with live model status---

- `src/options.js` — Settings for Gemini fallback

## Submission checklist (judge‑friendly)

---

- Uses 1+ Chrome built‑in AI APIs (on‑device first)

## 📁 Project Structure- Demonstrates clear user value on any web page

- Works offline when models are available (privacy by default)

```- Hybrid strategy with transparent source tagging

pagepilot-ai-extension/- Public repo, MIT license, and clear run instructions

├── manifest.json          # Chrome Extension manifest- Short demo video with the script above

├── icons/                 # Extension icons (16, 48, 128px)

├── src/---

│   ├── aiAdapter.js      # AI engine abstraction layer

│   ├── background.js     # Service worker (context menus, shortcuts)## License

│   ├── content.js        # Content script (overlays, replace selection)

│   ├── popup.html/css/js # Extension popup UIMIT © 2025 PagePilot Contributors

│   └── options.html/js   # Settings page
└── README.md             # You are here
```

---

## 🎬 Demo Script (2 minutes)

**1. Offline AI (30s)**
- Open news article, select text
- Press Alt+S → Show "Summary • On-device"
- Toggle airplane mode, press Alt+S again
- **Key Point:** "Works offline with on-device AI"

**2. Bilingual Translation (30s)**
- Select English text
- Press Alt+T → Show side-by-side overlay
- Click Copy button
- **Key Point:** "Language learning and accessibility"

**3. In-Place Editing (30s)**
- Open Gmail/Reddit textarea
- Type rough text, select it
- Press Alt+P → Click "Replace Selection"
- **Key Point:** "Seamless editing workflow"

**4. Privacy & Transparency (30s)**
- Click extension icon → Show model status
- Point to "On-device" tags in overlays
- **Key Point:** "Privacy-first, transparent AI source tagging"

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| No built-ins detected | Enable flags at `chrome://flags`, ensure hardware requirements met |
| Model shows "downloading" | Wait 5-10 minutes, check `chrome://on-device-internals` |
| Replace button not working | Ensure text is selected in editable field (textarea/contentEditable) |
| Empty Gemini response | Check API key in Options, verify network connection |
| Overlays not showing | Some pages block content scripts, try different webpage |

---

## 📊 Technical Highlights

- **6/6 Chrome Built-in AI APIs** — Comprehensive integration
- **Hybrid Fallback Strategy** — On-device → Cloud → Local
- **Progressive Enhancement** — Works everywhere, better with built-in AI
- **Error Handling** — Graceful degradation with user feedback
- **Clean Architecture** — Modular, maintainable, well-documented
- **Modern UX** — Loading states, copy/paste, in-place editing

---

## 🏆 Hackathon Submission

**Google Chrome Built-in AI Challenge 2025**

- ✅ Uses 6+ Chrome Built-in AI APIs
- ✅ Demonstrates clear user value
- ✅ Works offline (privacy-first)
- ✅ Production-ready quality
- ✅ MIT License, public repository

**Repository:** https://github.com/DevalPrime/PagePilot-AI-Extension

---

## 📝 License

MIT © 2025 PagePilot Contributors

---

## 🤝 Contributing

Built for the Google Chrome Built-in AI Challenge 2025. Feedback and contributions welcome!

**Made with ❤️ using Chrome Built-in AI**
