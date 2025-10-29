# PagePilot – Chrome Built‑in AI Sidekick

Privacy‑first reading and writing tools that run on your device using Chrome’s built‑in AI (Gemini Nano), with an optional Gemini cloud fallback for universal demos.

Why judges will care
- Real on‑device AI: works offline, private by default, visibly tagged as “On‑device.”
- Useful, not gimmicky: turns any web page into a workspace for summary, translation, proofreading, rewriting, writing, and prompt→JSON.
- Engineering quality: robust availability detection, graceful fallback, clean UX overlays, and clear troubleshooting.

What it does
- Summarizer — TL;DR or outline for selected text
- Translator — translate selection to your language (with bilingual side-by-side view)
- Proofreader — fix grammar/clarity
- Rewriter — change tone (formal, friendly, concise)
- Simplify — rewrite at grade 6 reading level
- Writer — draft from a prompt
- Prompt ➜ JSON — turn prompts into structured data

All AI runs locally when built‑ins are available. If not, flip on the optional Gemini fallback in Options.

---

## Features

- Context menu actions over any selection
- Popup UI to paste text or grab current selection
- Keyboard shortcuts (Alt+S Summarize, Alt+T Translate, Alt+P Proofread, Alt+R Simplify)
  
- Bilingual side-by-side overlay for translations
- Model status refresh button in popup
- Options page to enable Gemini fallback and set API/model
- Non‑blocking design with progressive enhancement
- Clean overlay near the selection with source tagging: On‑device, Gemini, or Local

---

## How to load and run

1) Open chrome://extensions
2) Enable Developer mode
3) Click “Load unpacked” and select this folder
4) Pin “PagePilot” from the toolbar puzzle menu

Optional: If your Chrome build doesn’t expose built‑ins yet, open the Options page and enable Gemini fallback with your API key.

---

## Enable built‑in AI locally (recommended for judges)

1) Hardware readiness
  - OS: Windows 10/11, macOS 13+, Linux, or Chromebook Plus
  - Storage: ~22 GB free (model download)
  - GPU: >4 GB VRAM, or CPU: 16 GB RAM + 4 cores

2) Enable the flags (if required on your build)
  - Go to chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
  - Set to Enabled and Relaunch
  - Go to chrome://flags/#rewriter-api-for-gemini-nano (for Rewriter API)
  - Set to Enabled and Relaunch

3) Confirm model status
  - Visit chrome://on-device-internals → Model Status
  - In DevTools on any page, run: await LanguageModel.availability(); // expect "available"

4) Reload the extension and try an action. Overlay titles should show "On‑device".

Note: Writer and Rewriter APIs are in origin trial (Chrome 137-148). For production use, sign up at https://developer.chrome.com/origintrials#/view_trial/444167513249415169 and add the token to manifest.json. For local testing, the flag above works.

---

## How it works

The adapter in `src/aiAdapter.js` chooses the best engine automatically:
- Try Chrome built‑ins (LanguageModel, Summarizer, Translator, Writer, Rewriter)
- Fall back to Gemini Developer API if enabled
- As a last resort, run local stubs so the UI still works

Service worker orchestrates context menus and messaging; the content script renders overlays; the popup shows model status and lets you run tools without selecting text.

---

## Files

- `manifest.json` — MV3 manifest
- `src/background.js` — context menus + orchestration
- `src/content.js` — selection overlays
- `src/aiAdapter.js` — built‑in AI detection + fallbacks
- `src/popup.html|css|js` — popup UI for all tools
- `src/options.html|js` — settings (fallback, API key, model)

---

## Demo script (<3 min)

1) Hook (10s): Open a news article. Select a paragraph. Press Alt+S (or right-click → Summarize). Show "Summary • On‑device." Toggle airplane mode and repeat to prove it works offline.
2) Bilingual (30s): Select text and press Alt+T (or Translate). Show side‑by‑side overlay with original and translated text. Mention language learners/accessibility.
3) Clarity (30s): In a textarea, select a rough paragraph and press Alt+P (Proofread). Copy/paste the improved text. Mention privacy (on‑device).
4) Simplify (20s): Select complex text, press Alt+R (Simplify). Show grade 6 reading level version in overlay. Copy/paste if needed.
5) Bonus (20s): Prompt➜JSON in popup to extract structured fields from unstructured text (event details). Show the JSON in console.
6) Close (10s): Click 🔄 Refresh in popup to show live model status; point at source tags; reiterate on‑device privacy + graceful fallback.

Tip: If built‑ins aren't available on a judge's machine, enable Gemini fallback. Overlays will show "• Gemini" so reviewers see the path.

---

## Troubleshooting

- No built‑ins detected: Normal on some Chrome versions/devices. Use Gemini fallback or ensure hardware/flag requirements.
- Model shows “downloading”: Wait a few minutes, then reload the extension.
- Empty Gemini response: Check API key, model (gemini‑1.5‑flash is fast), and network.
- Overlays not showing: Some pages block content scripts. Try a regular https article. Check the Service Worker console for warnings.

---

## Submission checklist (judge‑friendly)

- Uses 1+ Chrome built‑in AI APIs (on‑device first)
- Demonstrates clear user value on any web page
- Works offline when models are available (privacy by default)
- Hybrid strategy with transparent source tagging
- Public repo, MIT license, and clear run instructions
- Short demo video with the script above

---

## License

MIT © 2025 PagePilot Contributors
