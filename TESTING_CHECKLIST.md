# PagePilot Testing Checklist

## Before Recording Demo

### Extension Load
- [X] Open chrome://extensions
- [X] Enable Developer mode
- [X] Click "Load unpacked" and select `d:\google\pagepilot-ai-extension`
- [X] Pin PagePilot from toolbar
- [ ] Extension icon appears in toolbar (default icon is OK). Note: Chrome prefers PNG icons; custom SVG icons may not display.

### Built-in AI Check (if available)
- [x] Go to chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
- [x] Set to Enabled and Relaunch
- [ ] Go to chrome://flags/#rewriter-api-for-gemini-nano (REQUIRED for Writer/Rewriter)
- [ ] Set to Enabled and Relaunch
- [x] Visit chrome://on-device-internals → Model Status
- [x] Confirm model downloaded or downloading
- [ ] Open popup → should show "Built-ins: Summarizer, Translator, Writer, Rewriter, Proofreader"
- [x] Click 🔄 Refresh to re-check

### Fallback Setup (if built-ins unavailable)
- [x] Click Settings in popup
- [x] Enable "Use Gemini Fallback"
- [x] Enter Gemini API key (get from https://aistudio.google.com/app/apikey)
- [x] Set model to `gemini-2.5-pro` or whatever the latest model is
- [x] Set default target language (e.g., `en`)
- [x] Save and close options

## Feature Testing

### 1. Summarize (Alt+S)
- [x] Open a news article (e.g., https://en.wikipedia.org/wiki/Artificial_intelligence)
- [x] Select a long paragraph
- [x] Press Alt+S or right-click → PagePilot: Summarize Selection
- [x] Overlay appears with "Summary • On-device" (or Gemini/Local)
- [x] Summary is concise and relevant
- [x] Click Close

### 2. Translate (Alt+T) with Bilingual Overlay
- [x] Select text in English (or any language)
- [x] Press Alt+T or right-click → PagePilot: Translate Selection
- [x] If prompted, enter target language code (e.g., `es` for Spanish)
- [x] Overlay shows side-by-side: Original | Translated
- [x] Both sections visible and aligned
- [x] Click Close

### 3. Proofread (Alt+P)
- [x] Open a page with a textarea (e.g., Gmail compose, Reddit comment)
- [x] Type a sentence with errors: "this are a test sentense with erors"
- [x] Select the text
- [x] Press Alt+P or right-click → PagePilot: Proofread Selection
- [x] Overlay shows corrected text: "This is a test sentence with errors"
  
Note: Replace Selection is intentionally removed to avoid confusion in non-editable contexts. Copy/paste manually if needed.

### 4. Simplify (Alt+R)
- [x] Select complex academic or technical text
- [x] Press Alt+R or right-click → PagePilot: Simplify Reading Level
- [x] Overlay shows simplified version (grade 6 reading level)
- [x] Text uses simpler words and shorter sentences
  
Note: Replace Selection is intentionally removed. Copy/paste manually if needed.

### 5. Popup Actions
- [x] Click PagePilot icon in toolbar
- [x] Paste text into textarea or click "Use Selection"
- [x] Try each button:
  - [x] Summarize
  - [x] Proofread
  - [x] Rewrite (set Style to "friendly" or "formal")
  - [x] Simplify
  - [x] Translate (set Lang to target language)
  - [x] Write (enter a prompt like "Write a thank you email")
  - [x] Prompt➜JSON (enter "Event: Meeting at 3pm on Friday in Room 101")
- [x] Output section shows result
- [x] Status line shows "Result: On-device" (or Gemini/Local)

### 6. Model Status Refresh
- [x] Open popup
- [x] Click 🔄 Refresh button
- [x] Status line updates (e.g., "Built-ins: Summarizer, Translator" or "Models: Summarizer: downloading")
- [x] If downloading, wait and refresh again after a minute

### 7. Keyboard Shortcuts
- [x] Verify Alt+S works for Summarize
- [x] Verify Alt+T works for Translate
- [x] Verify Alt+P works for Proofread
- [x] Verify Alt+R works for Simplify
- [x] Each shows overlay with correct title and source tag

## Offline Test (Critical for Demo)

- [x] Open a news article
- [x] Select a paragraph
- [x] Press Alt+S → overlay shows "Summary • On-device"
- [x] **Turn on airplane mode** (or disconnect Wi-Fi)
- [x] Select a different paragraph
- [x] Press Alt+S again
- [x] Overlay still appears with summary (proves on-device execution)
- [x] **Turn off airplane mode** before continuing

## Source Tagging Verification

- [x] Try each action and note the source tag in overlay title:
  - Summarize → "Summary • On-device" (or Gemini/Local)
  - Translate → "Translation • On-device" (or Gemini/Local)
  - Proofread → "Proofread • On-device" (or Gemini/Local)
  - Simplify → "Simplified • On-device" (or Gemini/Local)
- [x] Verify source matches availability (built-ins vs fallback)

## Error Handling

- [x] Try action with no selection → shows "No selection" message
- [x] Try action with empty textarea in popup → shows "Please enter or select some text"
- [x] Try with Gemini fallback but no API key → shows error message
- [x] Try on a restricted page (chrome://extensions) → extension should handle gracefully

## Visual Polish

- [x] Popup shows tagline: "Privacy-first AI that runs on your device"
- [ ] Icons appear correctly (16px, 48px in toolbar)
- [x] Overlay styling is clean with dark theme
- [x] Buttons are styled and hover states work
- [ ] Replace Selection button appears only for proofread/rewrite/simplify

## Console Logging (for debugging)

- [x] Open DevTools → Console
- [x] Switch to Service Worker console (chrome://extensions → PagePilot → Service worker → inspect)
- [x] Try an action → should see logs:
  - `[PagePilot] contextMenus.onClicked: pp_summarize`
  - `[PagePilot] summarize: selection length 245`
  - `[PagePilot] summarize result ok? true source: builtin`
- [x] Check page console → should see:
  - `[PagePilot] content: loaded`
  - `[PagePilot] content: overlay shown`

## Ready for Demo?

- [ ] All features tested and working
- [ ] Offline test successful (critical!)
- [x] Bilingual overlay looks good
- [x] Source tags visible and accurate
- [ ] Model status shows correctly in popup
- [x] Keyboard shortcuts respond quickly
- [x] No console errors

---

## Demo Recording Tips

1. **Use a clean browser profile** (no other extensions visible)
2. **Pick a simple, readable webpage** (Wikipedia, news article)
3. **Show popup first** → point at tagline and status line
4. **Do offline test early** → builds trust
5. **Zoom to 150%** in browser so overlays are visible on video
6. **Speak clearly and concisely** → match the script timing
7. **Keep mouse movements slow** → easier to follow
8. **Show keyboard shortcuts** → Alt+S is faster than right-click
9. **Point at source tags** → "See, it says On-device"
10. **End with refresh button** → shows live model status

## Post-Demo

- [ ] Upload video to YouTube (unlisted or public)
- [ ] Add video link to README.md
- [ ] Push to GitHub
- [ ] Double-check LICENSE file is present (MIT)
- [ ] Verify GitHub repo is public
- [ ] Submit to hackathon portal with repo link + video link

Good luck! 🚀
