# PagePilot AI Extension – Chrome Built‑in AI Sidekick

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)
![Built-in AI](https://img.shields.io/badge/Chrome_AI-6_APIs-green)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Turn any webpage into an AI‑powered workspace. Privacy‑first reading and writing tools powered by Chrome’s built‑in AI (Gemini Nano), with optional Gemini Cloud API fallback.

---

## Features

### AI‑Powered Tools
- **Summarizer** — Generate concise summaries or outlines from selected text
- **Translator** — Translate to multiple languages with bilingual side‑by‑side view
- **Proofreader** — Fix grammar, spelling, and improve clarity
- **Rewriter** — Adjust tone (formal, friendly, concise, etc.)
- **Simplify** — Convert complex text to grade‑6 reading level
- **Writer** — Generate content from prompts
- **Prompt API** — Extract structured data (JSON) from text

### Enhanced User Experience
- **Copy to Clipboard** — One‑click copy for all results
- **Replace Selection** — Edit text in‑place for editable fields (textarea, contentEditable)
- **Loading Indicators** — Visual feedback during processing
- **Keyboard Shortcuts** — Fast access without using the mouse
- **Smart Overlays** — Results appear near your selection
- **Source Tagging** — Clearly shows where AI processing happened (On‑device, Gemini, or Local)

### Privacy & Performance
- **Privacy‑First** — Runs entirely on your device when using Chrome built‑in AI
- **Offline Capable** — Works without internet connection
- **Fast Processing** — No network latency with on‑device models
- **Smart Fallback** — Seamlessly switches between on‑device and cloud when needed

---

## Installation

### Load the Extension
1. Open `chrome://extensions` in Chrome
2. Enable **Developer mode** (toggle in the top‑right corner)
3. Click **Load unpacked**
4. Select the `pagepilot-ai-extension` folder
5. Pin the extension icon from the toolbar for easy access

### Enable Chrome Built‑in AI

#### System Requirements
- **Chrome:** Version 128+ (Chrome Canary or Dev channel recommended)
- **Storage:** ~22 GB free space for model download
- **Hardware:** 4 GB+ VRAM, or 16 GB RAM + 4 CPU cores

#### Configuration Steps
1. **Enable AI Flags**
   - Navigate to: `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input` → set to **Enabled** → click **Relaunch**
   - Navigate to: `chrome://flags/#prompt-api-for-gemini-nano` → set to **Enabled** → click **Relaunch**
   - Navigate to: `chrome://flags/#summarization-api-for-gemini-nano` → set to **Enabled** → click **Relaunch**
   - Navigate to: `chrome://flags/#writer-api-for-gemini-nano` → set to **Enabled** → click **Relaunch**\
   - Navigate to: `chrome://flags/#proofreader-api-for-gemini-nano` → set to **Enabled** → click **Relaunch**
   - Navigate to: `chrome://flags/#rewriter-api-for-gemini-nano` → set to **Enabled** → click **Relaunch**
   - Navigate to: `chrome://flags/#translation-api` → set to **Enabled** → click **Relaunch**
2. **Download AI Model**
   - Open DevTools Console (F12) on any page and run:
     ```javascript
     const session = await LanguageModel.create({
       monitor(m) {
         m.addEventListener("downloadprogress", e => {
           console.log(`Downloaded ${e.loaded} of ${e.total} bytes`);
         });
       }
     });
     ```
     Wait for the download to complete (~22 GB, may take 5–10 minutes).
3. **Verify Installation**
   ```javascript
   await ai.languageModel.availability();
   // Should return: "available"
   ```
4. **Check Model Status**
   - Visit: `chrome://on-device-internals/`
   - Verify the Gemini Nano model shows as “Available”

### Cloud Fallback (Optional)
If built‑in AI isn’t available on your system:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Click the PagePilot icon → **Options**
3. Enable **Gemini Fallback**
4. Paste your API key
5. Save settings

Results will show a “• Gemini” tag instead of “• On‑device”.

---

## Usage

### Context Menu (Right‑Click)
1. **Select text** on any webpage
2. **Right‑click** on the selection
3. Choose **PagePilot: [Action]**
4. View results in an overlay near your selection
   - Bilingual side‑by‑side overlay for translations

### Keyboard Shortcuts
| Shortcut | Action |
|---|---|
| **Alt+S** | Summarize selected text |
| **Alt+T** | Translate selected text |
| **Alt+P** | Proofread selected text |
| **Alt+R** | Simplify reading level |

### Extension Popup
Click the PagePilot icon in the toolbar to:
- Use AI tools without selecting text first
- Check real‑time model availability
- Access all features from one interface
- See source tags on results: On‑device, Gemini, or Local

### Using Results
- **Copy Button:** Click **Copy** to copy a result to the clipboard (shows “✓ Copied!”)
- **Replace Selection:** Available for Proofread, Rewrite, and Simplify when the selection is in an editable field (textarea, contentEditable, input)

---

## How It Works

### Architecture
```
User Action → Service Worker → AI Adapter → Results → Content Script → Overlay
```

### Components
| File | Purpose |
|---|---|
| `manifest.json` | Chrome Extension configuration |
| `src/background.js` | Service worker handling context menus and commands |
| `src/content.js` | Content script for overlay rendering and interactions |
| `src/aiAdapter.js` | AI engine abstraction with smart fallback logic |
| `src/popup.html` | Popup interface markup |
| `src/popup.css` | Popup styling |
| `src/popup.js` | Popup functionality |
| `src/options.html` | Settings page markup |
| `src/options.js` | Settings page functionality |

### Smart Engine Selection
PagePilot automatically chooses the best AI engine:
1. **Chrome Built‑in APIs** (Preferred)
   - On‑device processing (Gemini Nano)
   - Private, fast, works offline
   - Uses 6 Chrome AI APIs
2. **Gemini Cloud API** (Fallback)
   - When built‑in AI is unavailable
   - Requires API key
   - Universal compatibility
3. **Local Stubs** (Last Resort)
   - UI remains functional and shows helpful error messages

All processing is transparent with clear source tagging in results.

> Note: Writer and Rewriter APIs may be in origin trial ranges on some Chrome versions. For production use, sign up at https://developer.chrome.com/origintrials or target stable APIs.

---

## Troubleshooting

### Common Issues
| Issue | Solution |
|---|---|
| No built‑ins detected | Enable flags at `chrome://flags`, and verify hardware requirements |
| Model shows “downloading” | Wait 5–10 minutes and monitor at `chrome://on-device-internals` |
| Replace button missing | Only appears for editable fields (textarea, contentEditable, input) |
| Empty Gemini responses | Verify API key in Options, and check your internet connection |
| Overlays not appearing | Some sites block content scripts; try a different webpage |
| Slow first run | Initial model load takes time; subsequent runs are faster |

### Debug Mode
Check the console for detailed logs:
- Right‑click the extension icon → **Inspect popup** (popup logs)
- Press F12 on any page (content script logs)
- `chrome://extensions` → your extension → **Inspect service worker** (background logs)

---

## Development

### Setup
1. Clone the repository
2. Load as an unpacked extension in Chrome
3. Make changes to source files
4. Reload the extension at `chrome://extensions`
5. Test thoroughly (on‑device and Gemini fallback)

### Code Style
- Use ES6+ JavaScript
- Follow existing patterns in the codebase
- Add comments for complex logic
- Test with both on‑device and cloud AI

---

## Technical Highlights
- **6/6 Chrome Built‑in AI APIs** — Comprehensive integration
- **Hybrid Fallback Strategy** — On‑device → Cloud → Local
- **Progressive Enhancement** — Works everywhere, better with built‑in AI
- **Graceful Degradation** — Clear user feedback and fallbacks
- **Clean Architecture** — Modular, maintainable, well‑documented
- **Modern UX** — Loading states, copy/paste, in‑place editing

---

## License
MIT © 2025 PagePilot Contributors

---

## Links
- **Repository:** https://github.com/DevalPrime/PagePilot-AI-Extension
- **Chrome AI Documentation:** https://developer.chrome.com/docs/ai/built-in
- **Gemini API:** https://ai.google.dev/
