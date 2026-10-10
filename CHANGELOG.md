# Changelog

## 0.3.4 - Reliability and classical-driven generation

- Fixed a blank screen caused by corrupt or blocked browser storage; all stored and imported data is now validated and normalised.
- Project import now rejects malformed files with a specific reason, accepts partial data safely, and refuses files from newer schema versions.
- Prompts are derived from the page fields and stay in sync with edits; hand-edited prompts are kept and can be reset.
- Added autosave, overwrite confirmation for unsaved manual edits, and a save-state indicator.
- Classical scenes now drive generation: "按此素材生成" builds an 8-page blueprint and a matching video script from the scene's imagery, themes and hook, with a classical (宣纸 / 墨 / 青绿 / 朱砂) palette instead of the parenting one.
- "加一页" and "删除本页" work; page counts, progress and the title-length check are now dynamic. Removed placeholder controls that did nothing.
- Clipboard copy falls back gracefully and no longer reports success on failure.
- PWA: service worker derives its version and base path from the registration URL, caches only successful same-origin responses; added PNG and maskable icons.
- Export file names include the topic; both exports carry the CC BY attribution.
- Accessibility: labelled inputs, tab roles, live-region toasts, visible focus, explicit button types.
- Split the code into `src/lib` modules, added unit tests (`npm test`), removed unused dev dependencies, moved the stray parenting plan into `docs/`.

## 0.3.3 - Classical inspiration library

- Added a first data module for Shijing, Chuci, Tang poetry, Song lyrics, and classical novel scenes.
- Added a visible classical inspiration library with category filters.
- Added one-click topic seeding and visual-prompt copy actions from classical scenes.

## 0.3.2 - Project import/export

- Added portable JSON project export.
- Added JSON project import for continuing work across browsers or devices.
- Updated README roadmap and demo links.

## 0.3.1 - PWA basics

- Added a web app manifest for desktop and mobile installation.
- Added a service worker that caches the app shell and core assets.
- Updated install documentation for Chrome, Edge, Android, and iPhone Safari.
- Updated README demo links and roadmap status.

## 0.3.0 - Douyin mode

- Added Douyin short-video storyboard mode.
- Added 15s, 30s, and 60s script generation flows.
- Added video scene preview, voiceover, subtitle, shot, and prompt editing.
- Added Markdown export for short-video shooting checklists.
