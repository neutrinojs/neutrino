# Neutrino WebExtension Preset

## Commands

- `start`: 
  - Build & watch the extension in `dev`
  - Apply web-ext lint on `dev`
  - Load the extension with web-ext in Firefox
- `build`: 
  - Build an optimized version in `build/extension`
  - Apply web-ext lint on `build/extension`
  - Build a ZIP and a XPI files from `build/extension` in `build/` 
- `lint`: 
  - Apply web-ext lint on `src`


## Build
- All entries in main are bundle at the root (JS + HTML)
- All other files are copied

## To Do
 - Read manifest and only creates XPI if applications.gecko.id is present ([source](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext))
 - Read manifest to find the entries automatically
 - Avoid creating useless HTML for content scripts & background.js
 - Keep entry structure `popup/popup.js -> popup/popup.html`
 - Remove `dev/` folder when start command ends
 - What about pages in tab
 - What about the tests

## Problems
 - Copied files are not removed in ./dev if removed from ./src
 - New files in ./src don't trigger a rebuild (but are copied after a rebuild due to a modification on another file)
 - `start` only:
    - Bundle files contain eval() function that can't be load (Not any more... ???)
      - For Extension Page: "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'",
      - For content scripts, rely on the page CSP and can't be overwritten so most of the time won't work...
- `build` content script is not working
- Both: Lots of error in bundled files
```
   ReferenceError: reference to undefined property "disabled"[Learn More]  CustomizableUI.jsm:2480:5
   TypeError: cannot use 'in' operator to search for 'canGoBack' in 'browser'[Learn More]  tabbrowser.xml:2473:1
   ReferenceError: reference to undefined property "additionalBackgrounds"[Learn More]  LightweightThemeConsumer.jsm:161:5
   ReferenceError: reference to undefined property "backgroundsAlignment"[Learn More]  LightweightThemeConsumer.jsm:205:5
   ReferenceError: reference to undefined property "initialPageLoadedFromURLBar"[Learn More]  tabbrowser.xml:697:1
   ...
```
