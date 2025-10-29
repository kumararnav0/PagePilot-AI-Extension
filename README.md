# PagePilot AI Extension# PagePilot – Chrome Built‑in AI Sidekick# PagePilot – Chrome Built‑in AI Sidekick



**Turn any webpage into an AI-powered workspace.** Privacy-first reading and writing tools powered by Chrome's built-in AI (Gemini Nano), with optional cloud fallback.



![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)**Turn any webpage into an AI-powered workspace.** Privacy-first reading and writing tools that run on your device using Chrome's built-in AI (Gemini Nano), with optional Gemini cloud fallback.Privacy‑first reading and writing tools that run on your device using Chrome’s built‑in AI (Gemini Nano), with an optional Gemini cloud fallback for universal demos.

![Built-in AI](https://img.shields.io/badge/Chrome_AI-6_APIs-green)

![License](https://img.shields.io/badge/license-MIT-blue.svg)



---## 🎯 Why This MattersWhy judges will care



## 🚀 Features- Real on‑device AI: works offline, private by default, visibly tagged as “On‑device.”



### AI-Powered Tools- **🔒 Real On-Device AI**: Works offline, private by default, visibly tagged as "On-device"- Useful, not gimmicky: turns any web page into a workspace for summary, translation, proofreading, rewriting, writing, and prompt→JSON.



- **📝 Summarizer** — Generate concise summaries or outlines from selected text- **💡 Practical, Not Gimmicky**: 7 essential tools that enhance every webpage- Engineering quality: robust availability detection, graceful fallback, clean UX overlays, and clear troubleshooting.

- **🌐 Translator** — Translate to multiple languages with bilingual side-by-side view

- **✍️ Proofreader** — Fix grammar, spelling, and improve clarity- **🏗️ Production-Ready**: Robust detection, graceful fallback, polished UX with copy/replace features

- **🔄 Rewriter** — Adjust tone (formal, friendly, concise, etc.)

- **📖 Simplify** — Convert complex text to grade 6 reading levelWhat it does

- **✏️ Writer** — Generate content from prompts

- **🎯 Prompt API** — Extract structured data (JSON) from text## ✨ Features- Summarizer — TL;DR or outline for selected text



### Enhanced User Experience- Translator — translate selection to your language (with bilingual side-by-side view)



- 📋 **Copy to Clipboard** — One-click copy for all results**6 Chrome Built-in AI APIs** + Gemini fallback:- Proofreader — fix grammar/clarity

- ↻ **Replace Selection** — Edit text in-place for editable fields (textarea, contentEditable)

- ⏳ **Loading Indicators** — Visual feedback during processing- Rewriter — change tone (formal, friendly, concise)

- ⌨️ **Keyboard Shortcuts** — Fast access without using the mouse

- 🎨 **Smart Overlays** — Results appear near your selection- **📝 Summarizer** — TL;DR or outline for selected text- Simplify — rewrite at grade 6 reading level

- 🏷️ **Source Tagging** — See where AI processing happened (On-device, Gemini, or Local)

- **🌐 Translator** — Bilingual side-by-side view with 5+ languages- Writer — draft from a prompt

### Privacy & Performance

- **✍️ Proofreader** — Fix grammar and clarity- Prompt ➜ JSON — turn prompts into structured data

- 🔒 **Privacy-First** — Runs entirely on your device when using Chrome built-in AI

- ✈️ **Offline Capable** — Works without internet connection- **🔄 Rewriter** — Change tone (formal, friendly, concise)

- ⚡ **Fast Processing** — No network latency with on-device models

- 🔄 **Smart Fallback** — Seamlessly switches between on-device and cloud when needed- **📖 Simplify** — Grade 6 reading level conversionAll AI runs locally when built‑ins are available. If not, flip on the optional Gemini fallback in Options.



---- **✏️ Writer** — Draft content from prompts



## 📦 Installation- **🎯 Prompt API** — Structured JSON extraction---



### Load the Extension



1. Open `chrome://extensions` in Chrome**Enhanced UX:**## Features

2. Enable **Developer mode** (toggle in top-right corner)

3. Click **"Load unpacked"**- 📋 **Copy Button** — One-click copy to clipboard

4. Select the `pagepilot-ai-extension` folder

5. Pin the extension icon from the toolbar for easy access- ↻ **Replace Selection** — Edit text in-place for editable fields- Context menu actions over any selection



### Enable Chrome Built-in AI- ⏳ **Loading States** — Spinner feedback during processing- Popup UI to paste text or grab current selection



**System Requirements:**- ⌨️ **Keyboard Shortcuts** — Alt+S (Summarize), Alt+T (Translate), Alt+P (Proofread), Alt+R (Simplify)- Keyboard shortcuts (Alt+S Summarize, Alt+T Translate, Alt+P Proofread, Alt+R Simplify)

- **Chrome:** Version 128+ (Chrome Canary or Dev channel recommended)

- **Storage:** ~22GB free space for model download- 🎨 **Smart Overlays** — Results appear near your selection with source tagging  

- **Hardware:** 4GB+ VRAM, or 16GB RAM + 4 CPU cores

- Bilingual side-by-side overlay for translations

**Configuration Steps:**

---- Model status refresh button in popup

1. **Enable AI Flags**

   - Navigate to: `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`- Options page to enable Gemini fallback and set API/model

   - Set to **Enabled** → Click **Relaunch**

   - Navigate to: `chrome://flags/#rewriter-api-for-gemini-nano`## 🚀 Quick Start- Non‑blocking design with progressive enhancement

   - Set to **Enabled** → Click **Relaunch**

- Clean overlay near the selection with source tagging: On‑device, Gemini, or Local

2. **Download AI Model**

   ### Installation

   Open DevTools Console (F12) on any page and run:

   ```javascript---

   const session = await ai.languageModel.create({

     monitor(m) {1. Open `chrome://extensions`

       m.addEventListener("downloadprogress", e => {

         console.log(`Downloaded ${e.loaded} of ${e.total} bytes`);2. Enable **Developer mode** (top-right toggle)## How to load and run

       });

     }3. Click **"Load unpacked"** and select this folder

   });

   ```4. Pin **PagePilot** from the toolbar1) Open chrome://extensions

   

   Wait for download to complete (~22GB, may take 5-10 minutes).2) Enable Developer mode



3. **Verify Installation**### Enable Built-in AI (Recommended)3) Click “Load unpacked” and select this folder

   ```javascript

   await ai.languageModel.availability();4) Pin “PagePilot” from the toolbar puzzle menu

   // Should return: "readily"

   ```**Requirements:**



4. **Check Model Status**- Chrome 128+ (Canary/Dev recommended)Optional: If your Chrome build doesn’t expose built‑ins yet, open the Options page and enable Gemini fallback with your API key.

   - Visit: `chrome://on-device-internals/`

   - Verify Gemini Nano model shows as "Available"- 22GB free storage (model download)



### Cloud Fallback (Optional)- 4GB+ VRAM OR 16GB RAM + 4 CPU cores---



If built-in AI isn't available on your system:



1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)**Enable Flags:**## Enable built‑in AI locally (recommended for judges)

2. Click the PagePilot icon → **Options**

3. Enable **Gemini Fallback**1. Navigate to `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`

4. Paste your API key

5. Save settings2. Set to **Enabled** and **Relaunch**1) Hardware readiness



Results will show "• Gemini" tag instead of "• On-device"3. Navigate to `chrome://flags/#rewriter-api-for-gemini-nano`  - OS: Windows 10/11, macOS 13+, Linux, or Chromebook Plus



---4. Set to **Enabled** and **Relaunch**  - Storage: ~22 GB free (model download)



## 🎮 Usage  - GPU: >4 GB VRAM, or CPU: 16 GB RAM + 4 cores



### Context Menu (Right-Click)**Download Model:**



1. **Select text** on any webpageOpen DevTools console on any page:2) Enable the flags (if required on your build)

2. **Right-click** on the selection

3. Choose **PagePilot: [Action]**```javascript  - Go to chrome://flags/#prompt-api-for-gemini-nano-multimodal-input

4. View results in an overlay near your selection

const session = await ai.languageModel.create({  - Set to Enabled and Relaunch

### Keyboard Shortcuts

  monitor(m) {  - Go to chrome://flags/#rewriter-api-for-gemini-nano (for Rewriter API)

| Shortcut | Action |

|----------|--------|    m.addEventListener("downloadprogress", e => {  - Set to Enabled and Relaunch

| **Alt+S** | Summarize selected text |

| **Alt+T** | Translate selected text |      console.log(`Downloaded ${e.loaded} of ${e.total} bytes`);

| **Alt+P** | Proofread selected text |

| **Alt+R** | Simplify reading level |    });3) Confirm model status



### Extension Popup  }  - Visit chrome://on-device-internals → Model Status



Click the PagePilot icon in the toolbar to:});  - In DevTools on any page, run: await LanguageModel.availability(); // expect "available"

- Use AI tools without selecting text first

- Check real-time model availability```

- Access all features from one interface

4) Reload the extension and try an action. Overlay titles should show "On‑device".

### Using Results

**Verify:**

**Copy Button:**

- Click **📋 Copy** to copy result to clipboard```javascriptNote: Writer and Rewriter APIs are in origin trial (Chrome 137-148). For production use, sign up at https://developer.chrome.com/origintrials#/view_trial/444167513249415169 and add the token to manifest.json. For local testing, the flag above works.

- Success feedback shows "✓ Copied!"

await ai.languageModel.availability(); // should return "readily"

**Replace Selection:**

- Available for Proofread, Rewrite, and Simplify actions```---

- Only appears when text is in an editable field

- Click **↻ Replace Selection** to update original text



---### Gemini Fallback (Optional)## How it works



## 🏗️ How It Works



### ArchitectureIf built-in AI isn't available:The adapter in `src/aiAdapter.js` chooses the best engine automatically:



```1. Get API key from [Google AI Studio](https://aistudio.google.com/apikey)- Try Chrome built‑ins (LanguageModel, Summarizer, Translator, Writer, Rewriter)

User Action → Service Worker → AI Adapter → Results → Content Script → Overlay

```2. Open extension Options page- Fall back to Gemini Developer API if enabled



**Components:**3. Enable Gemini fallback and paste your API key- As a last resort, run local stubs so the UI still works



| File | Purpose |4. Overlays will show "• Gemini" instead of "• On-device"

|------|---------|

| `manifest.json` | Chrome Extension configuration |Service worker orchestrates context menus and messaging; the content script renders overlays; the popup shows model status and lets you run tools without selecting text.

| `src/background.js` | Service worker handling context menus and commands |

| `src/content.js` | Content script for overlay rendering and interactions |---

| `src/aiAdapter.js` | AI engine abstraction with smart fallback logic |

| `src/popup.js` | Extension popup interface |---

| `src/options.js` | Settings page for configuration |

## 🎮 Usage

### Smart Engine Selection

## Files

PagePilot automatically chooses the best AI engine:

### Context Menu (Right-Click)

1. **🥇 Chrome Built-in APIs** (Preferred)

   - On-device processing (Gemini Nano)1. Select text on any webpage- `manifest.json` — MV3 manifest

   - Private, fast, works offline

   - Uses 6 Chrome AI APIs2. Right-click → **PagePilot: [Action]**- `src/background.js` — context menus + orchestration



2. **🥈 Gemini Cloud API** (Fallback)3. Results appear in overlay near your selection- `src/content.js` — selection overlays

   - When built-in AI unavailable

   - Universal compatibility- `src/aiAdapter.js` — built‑in AI detection + fallbacks

   - Requires API key

### Keyboard Shortcuts- `src/popup.html|css|js` — popup UI for all tools

3. **🥉 Local Stubs** (Last Resort)

   - UI remains functional- **Alt+S** — Summarize selection- `src/options.html|js` — settings (fallback, API key, model)

   - Shows helpful error messages

- **Alt+T** — Translate selection

All processing is transparent with clear source tagging in results.

- **Alt+P** — Proofread selection---

---

- **Alt+R** — Simplify reading level

## 🔧 Troubleshooting

## Demo script (<3 min)

### Common Issues

### Popup Interface

| Issue | Solution |

|-------|----------|Click the PagePilot icon to:1) Hook (10s): Open a news article. Select a paragraph. Press Alt+S (or right-click → Summarize). Show "Summary • On‑device." Toggle airplane mode and repeat to prove it works offline.

| **No built-ins detected** | Enable flags at `chrome://flags`, verify hardware requirements |

| **Model shows "downloading"** | Wait 5-10 minutes, monitor at `chrome://on-device-internals` |- Use tools without selecting text2) Bilingual (30s): Select text and press Alt+T (or Translate). Show side‑by‑side overlay with original and translated text. Mention language learners/accessibility.

| **Replace button missing** | Only appears for editable fields (textarea, contentEditable, input) |

| **Empty Gemini responses** | Verify API key in Options, check internet connection |- Check model availability status3) Clarity (30s): In a textarea, select a rough paragraph and press Alt+P (Proofread). Copy/paste the improved text. Mention privacy (on‑device).

| **Overlays not appearing** | Some sites block content scripts, try a different webpage |

| **Slow first run** | Initial model load takes time, subsequent runs are fast |- Access all 7 AI features4) Simplify (20s): Select complex text, press Alt+R (Simplify). Show grade 6 reading level version in overlay. Copy/paste if needed.



### Debug Mode5) Bonus (20s): Prompt➜JSON in popup to extract structured fields from unstructured text (event details). Show the JSON in console.



Check the console for detailed logs:---6) Close (10s): Click 🔄 Refresh in popup to show live model status; point at source tags; reiterate on‑device privacy + graceful fallback.

- Right-click extension icon → **Inspect popup** (for popup logs)

- F12 on any page (for content script logs)

- `chrome://extensions` → Extension details → **Inspect service worker** (for background logs)

## 🏗️ How It WorksTip: If built‑ins aren't available on a judge's machine, enable Gemini fallback. Overlays will show "• Gemini" so reviewers see the path.

---



## 📊 Technical Highlights

**Smart Engine Selection:**---

### Chrome Built-in AI APIs Used

1. Try Chrome Built-in APIs (on-device, private, fast)

- ✅ **Prompt API** (LanguageModel) — General purpose AI

- ✅ **Summarizer API** — Text summarization2. Fall back to Gemini API if enabled (cloud, universal)## Troubleshooting

- ✅ **Translator API** — Language translation

- ✅ **Writer API** — Content generation3. Local stubs as last resort (UI always works)

- ✅ **Rewriter API** — Tone and style adjustment

- ✅ **Proofreader API** (via Writer) — Grammar and clarity- No built‑ins detected: Normal on some Chrome versions/devices. Use Gemini fallback or ensure hardware/flag requirements.



### Engineering Principles**Architecture:**- Model shows “downloading”: Wait a few minutes, then reload the extension.



- **Progressive Enhancement** — Works everywhere, better with built-in AI- `src/aiAdapter.js` — Detects availability, handles fallbacks- Empty Gemini response: Check API key, model (gemini‑1.5‑flash is fast), and network.

- **Graceful Degradation** — Intelligent fallback strategy

- **Privacy by Default** — On-device processing when possible- `src/background.js` — Orchestrates context menus and commands- Overlays not showing: Some pages block content scripts. Try a regular https article. Check the Service Worker console for warnings.

- **Zero Config** — Smart detection and automatic setup

- **Clean UX** — Non-intrusive overlays with clear feedback- `src/content.js` — Renders overlays with copy/replace buttons

- **Modular Architecture** — Easy to extend and maintain

- `src/popup.js` — Popup UI with live model status---

---

- `src/options.js` — Settings for Gemini fallback

## 🎬 Demo Workflow

## Submission checklist (judge‑friendly)

### 1. Reading Articles (Summarize)

- Open a news article or blog post---

- Select a long paragraph

- Press **Alt+S** or right-click → Summarize- Uses 1+ Chrome built‑in AI APIs (on‑device first)

- Get instant TL;DR without leaving the page

- **Bonus:** Works offline in airplane mode## 📁 Project Structure- Demonstrates clear user value on any web page



### 2. Language Learning (Translate)- Works offline when models are available (privacy by default)

- Select text in English

- Press **Alt+T**```- Hybrid strategy with transparent source tagging

- View original and translation side-by-side

- Click **Copy** to save both versionspagepilot-ai-extension/- Public repo, MIT license, and clear run instructions

- Perfect for language learners and multilingual users

├── manifest.json          # Chrome Extension manifest- Short demo video with the script above

### 3. Writing Assistance (Proofread)

- Compose email in Gmail or post on Reddit├── icons/                 # Extension icons (16, 48, 128px)

- Select your draft text

- Press **Alt+P**├── src/---

- Click **Replace Selection** to update instantly

- Privacy-protected on-device processing│   ├── aiAdapter.js      # AI engine abstraction layer



### 4. Content Simplification (Simplify)│   ├── background.js     # Service worker (context menus, shortcuts)## License

- Select complex technical or legal text

- Press **Alt+R**│   ├── content.js        # Content script (overlays, replace selection)

- Get grade 6 reading level version

- Great for accessibility and comprehension│   ├── popup.html/css/js # Extension popup UIMIT © 2025 PagePilot Contributors



### 5. Structured Data (Prompt API)│   └── options.html/js   # Settings page

- Open extension popup└── README.md             # You are here

- Enter unstructured text (e.g., event description)```

- Request JSON extraction

- Get structured data for further processing---



---## 🎬 Demo Script (2 minutes)



## 📁 Project Structure**1. Offline AI (30s)**

- Open news article, select text

```- Press Alt+S → Show "Summary • On-device"

pagepilot-ai-extension/- Toggle airplane mode, press Alt+S again

├── manifest.json              # Extension manifest (Manifest V3)- **Key Point:** "Works offline with on-device AI"

├── LICENSE                    # MIT License

├── README.md                  # This file**2. Bilingual Translation (30s)**

├── icons/                     # Extension icons- Select English text

│   ├── icon16.png            # Toolbar icon (16x16)- Press Alt+T → Show side-by-side overlay

│   ├── icon48.png            # Extension manager (48x48)- Click Copy button

│   └── icon128.png           # Chrome Web Store (128x128)- **Key Point:** "Language learning and accessibility"

└── src/                       # Source code

    ├── aiAdapter.js          # AI engine abstraction and fallback logic**3. In-Place Editing (30s)**

    ├── background.js         # Service worker (context menus, shortcuts)- Open Gmail/Reddit textarea

    ├── content.js            # Content script (overlays, UI interactions)- Type rough text, select it

    ├── popup.html            # Popup interface markup- Press Alt+P → Click "Replace Selection"

    ├── popup.css             # Popup styling- **Key Point:** "Seamless editing workflow"

    ├── popup.js              # Popup functionality

    ├── options.html          # Settings page markup**4. Privacy & Transparency (30s)**

    └── options.js            # Settings functionality- Click extension icon → Show model status

```- Point to "On-device" tags in overlays

- **Key Point:** "Privacy-first, transparent AI source tagging"

---

---

## 🤝 Contributing

## 🛠️ Troubleshooting

Contributions, issues, and feature requests are welcome!

| Issue | Solution |

### Development Setup|-------|----------|

| No built-ins detected | Enable flags at `chrome://flags`, ensure hardware requirements met |

1. Clone the repository| Model shows "downloading" | Wait 5-10 minutes, check `chrome://on-device-internals` |

2. Load as unpacked extension in Chrome| Replace button not working | Ensure text is selected in editable field (textarea/contentEditable) |

3. Make changes to source files| Empty Gemini response | Check API key in Options, verify network connection |

4. Reload extension at `chrome://extensions`| Overlays not showing | Some pages block content scripts, try different webpage |

5. Test thoroughly

---

### Code Style

## 📊 Technical Highlights

- Use ES6+ JavaScript

- Follow existing patterns in codebase- **6/6 Chrome Built-in AI APIs** — Comprehensive integration

- Add comments for complex logic- **Hybrid Fallback Strategy** — On-device → Cloud → Local

- Test with both on-device and cloud AI- **Progressive Enhancement** — Works everywhere, better with built-in AI

- **Error Handling** — Graceful degradation with user feedback

---- **Clean Architecture** — Modular, maintainable, well-documented

- **Modern UX** — Loading states, copy/paste, in-place editing

## 📝 License

---

MIT © 2025 PagePilot Contributors

## 🏆 Hackathon Submission

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

**Google Chrome Built-in AI Challenge 2025**

---

- ✅ Uses 6+ Chrome Built-in AI APIs

## 🔗 Links- ✅ Demonstrates clear user value

- ✅ Works offline (privacy-first)

- **Repository:** https://github.com/DevalPrime/PagePilot-AI-Extension- ✅ Production-ready quality

- **Chrome AI Documentation:** https://developer.chrome.com/docs/ai/built-in- ✅ MIT License, public repository

- **Gemini API:** https://ai.google.dev/

**Repository:** https://github.com/DevalPrime/PagePilot-AI-Extension

---

---

**Made with ❤️ using Chrome Built-in AI**

## 📝 License

MIT © 2025 PagePilot Contributors

---

## 🤝 Contributing

Built for the Google Chrome Built-in AI Challenge 2025. Feedback and contributions welcome!

**Made with ❤️ using Chrome Built-in AI**
