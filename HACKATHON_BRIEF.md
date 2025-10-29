# PagePilot – Hackathon Submission Brief

## What makes PagePilot a winning entry

### Core Innovation
**Privacy-first AI that actually works offline** — not just a demo, but a real tool that runs Chrome's built-in Gemini Nano models locally. When you turn on airplane mode and summarize text, it still works. That's the "wow" moment.

### Key Differentiators (vs other 12.8k entries)

1. **Bilingual Learning Mode**
   - Side-by-side overlay showing original + translated text
   - Perfect for language learners, ELLs, accessibility
   - Demo: Select "Bonjour le monde" → Alt+T → see English alongside French

2. **Replace Selection**
   - One-click to replace proofread/simplified text in textareas
   - Seamless workflow for email, forms, content creation
   - Demo: Type rough draft → select → Alt+P → "Replace Selection" → polished

3. **Simplify Reading Level**
   - Rewrite complex text at grade 6 reading level
   - Accessibility win for diverse audiences
   - Demo: Academic paper → Alt+R → easy-to-read version

4. **Keyboard Power Users**
   - Alt+S (Summarize), Alt+T (Translate), Alt+P (Proofread), Alt+R (Simplify)
   - Fast, non-intrusive, productivity-focused
   - Demo: Show speed vs right-click menus

5. **Hybrid Strategy with Source Tagging**
   - Every result shows "On-device," "Gemini," or "Local"
   - Transparent fallback ensures it works on any judge's machine
   - Demo: Point at overlay titles and popup status line

6. **Engineering Quality**
   - Model availability detection with live refresh
   - Graceful degradation (built-ins → cloud → stubs)
   - Clean UX with overlays, icons, tagline

### Technical Stack
- Chrome Built-in AI APIs: Summarizer (stable), Translator (stable), Writer/Rewriter (origin trial), Prompt API (EPP)
- Fallback: Gemini 1.5 Flash Developer API
- MV3: Service worker, content scripts, popup, options, keyboard commands
- Progressive enhancement: works offline, private by default

### Demo Video Script (2:45)

**0:00–0:10 Hook**
"PagePilot runs on-device AI. Watch: I'll summarize this article…" [Alt+S, show overlay "Summary • On-device"] "Now airplane mode…" [toggle, Alt+S again] "Still works. Privacy + offline."

**0:10–0:40 Bilingual Learning**
"Here's French text. Alt+T for translate…" [show side-by-side overlay] "Original and translation together. Perfect for language learners or anyone reading multilingual content."

**0:40–1:10 Replace Selection**
"In this textarea, I have a rough draft. Select it, Alt+P to proofread…" [overlay appears] "Now 'Replace Selection'—boom, instant polish. Your data never leaves your device."

**1:10–1:30 Simplify Reading**
"This paragraph is complex. Alt+R to simplify…" [show grade 6 version] "Now it's accessible to more readers. Click Replace if you want."

**1:30–1:50 Bonus: Prompt→JSON**
"Popup: paste messy event text, click Prompt→JSON…" [show structured output] "Extracted fields automatically."

**1:50–2:45 Close**
"Click refresh in popup—live model status. See 'Built-ins: Summarizer, Translator' when available. Source tags show where results came from. If a judge doesn't have built-ins yet, enable Gemini fallback—overlays will say 'Gemini' so you see the hybrid path. Privacy-first, offline-capable, useful on any webpage. PagePilot."

### Judging Criteria Alignment

- **Innovation**: On-device + offline + bilingual + simplify + replace = unique combo
- **Technical Depth**: Real built-in APIs, availability detection, fallback, keyboard shortcuts
- **Usefulness**: Works on any webpage; helps students, writers, knowledge workers, multilingual users
- **Polish**: Icons, tagline, clean overlays, refresh button, source tagging, comprehensive README

### Submission Checklist

- ✅ Uses 1+ Chrome built-in AI APIs (Summarizer, Translator, Writer, Rewriter, Prompt)
- ✅ Demonstrates clear user value (reading, writing, learning, accessibility)
- ✅ Works offline when models available
- ✅ Hybrid strategy with transparent source tagging
- ✅ Public GitHub repo with MIT license
- ✅ Clear run instructions in README
- ✅ <3 min demo video (script above)
- ✅ Keyboard shortcuts, replace selection, bilingual overlay, simplify reading level
- ✅ Icons and branding

### Optional Enhancements (if time permits)

1. **Streaming UI**: Show progressive tokens for summaries (feels premium)
2. **Reading level selector**: Let users pick grade 6/8/12
3. **Multi-language detection**: Auto-detect source language for translation
4. **Export results**: Download summary/translation as .txt
5. **Dark/light theme toggle**: Appeal to broader audience

### Why This Can Win

- **Judges can test it immediately**: No server setup, just load the extension
- **Offline demo is undeniable**: Airplane mode + summarize = privacy proof
- **Bilingual overlay is visual**: Side-by-side comparison is memorable
- **Replace selection is practical**: Real workflow improvement, not a toy
- **Source tagging shows hybrid thinking**: Judges see you considered their environment
- **Keyboard shortcuts show polish**: Power users will notice and appreciate
- **Simplify reading is accessibility-minded**: Shows you thought about diverse users

### Risks & Mitigations

- **Risk**: Judge doesn't have built-ins enabled
  - **Mitigation**: Gemini fallback works everywhere; README has clear setup steps; overlays show source
- **Risk**: Other entries also use built-ins
  - **Mitigation**: Your combo of features (bilingual, replace, simplify, keyboard) is unique
- **Risk**: Video is too technical
  - **Mitigation**: Script shows real use cases (article, email, learning) not just API demos

### Final Positioning

**Tagline**: Privacy-first AI that runs on your device

**One-liner**: PagePilot turns any webpage into a workspace for summary, translation, proofreading, and simplification—using Chrome's built-in AI for privacy and offline access, with a seamless Gemini fallback for universal demos.

**Judge's first impression**: "This is polished, useful, and actually demonstrates on-device AI working offline. The bilingual overlay and replace selection features are smart. I can see myself using this."

---

**Next Steps**: Record the 2:45 demo video following the script above, upload to YouTube (unlisted is fine), add the link to your GitHub README, and submit before the deadline. Good luck! 🚀
