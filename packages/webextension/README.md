# Neutrino WebExtension Preset

## Commands

- `start` build and watch in `./dev` and run web-ext
- `build` build in `./build` 

## Build

- All entries in main are bundle at the root (JS + HTML)
- All other files are copied

## To Do
 - Add web-ext lint support
 - Add web-ext build to create .zip & .xpi
 - Read manifest to find the entries automatically
 - Avoid creating useless HTML for content scripts & background.js
 - Keep entry structure `popup/popup.js -> popup/popup.html`
 - Remove `dev/` folder when start command ends

## Problems
 - Copied files are not removed in ./dev if removed from ./src
 - New files in ./src don't trigger a rebuild (but are copied after a rebuild due to a modification on another file)
 - In `start` only:
    - Bundle files contain eval() function that can't be load
      - For Extension Page: "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'",
      - For content scripts, rely on the page CSP and can't be overwritten so most of the time won't work...
    - Lots of error in bundled files
```
   ReferenceError: reference to undefined property "disabled"[Learn More]  CustomizableUI.jsm:2480:5
   TypeError: cannot use 'in' operator to search for 'canGoBack' in 'browser'[Learn More]  tabbrowser.xml:2473:1
   ReferenceError: reference to undefined property "additionalBackgrounds"[Learn More]  LightweightThemeConsumer.jsm:161:5
   ReferenceError: reference to undefined property "backgroundsAlignment"[Learn More]  LightweightThemeConsumer.jsm:205:5
   ReferenceError: reference to undefined property "initialPageLoadedFromURLBar"[Learn More]  tabbrowser.xml:697:1
   ...
```
