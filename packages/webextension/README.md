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

## Output

### Create entries find in the Manifest

#### Entries
  - `background.scripts` (JS)
  - `background.page` (HTML)
  - `content_scripts` (JS)
  - `browser_action.default_popup` (HTML)
  - `options_ui.page` (HTML)
  - `sidebar_action.default_panel` (HTML)
  - `devtools_page` (HTML)

#### Notes
There are 2 cases for HTML entries:
 1. The file exists and is copied.
 2. Else a template HTML file is created. 
In both cases, the bundle is generated.

Some entries are only bundled in JavaScript.

### Create entries find in `options.mains` in neutrinorc.js 
See `@neutrinojs/Web`.

### Copy files
  - `manifest.json`
  - `_locales/` (All)
  - `static/` (All) 

## To Do
 - Read manifest and only creates XPI if applications.gecko.id is present ([source](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext))
 - Remove `dev/` folder when start command ends
 - Ignore Files on build 
 - Options
   - Boolean: Create XPI on build (For FF only)
   - Boolean: Use web-ext on start (For FF only, one's can start manually with another browser)

## Problems
 - Copied files are not removed in ./dev if removed from ./src
 - New files in ./src don't trigger a rebuild (but are copied after a rebuild due to a modification on another file)
 - Lots of warnings due to `eval`
- `build`
  - All js target (without HTML) are not working because `runtime.js` is not imported...
- Both: Lots of error in bundled files
```
   ReferenceError: reference to undefined property "disabled"[Learn More]  CustomizableUI.jsm:2480:5
   TypeError: cannot use 'in' operator to search for 'canGoBack' in 'browser'[Learn More]  tabbrowser.xml:2473:1
   ReferenceError: reference to undefined property "additionalBackgrounds"[Learn More]  LightweightThemeConsumer.jsm:161:5
   ReferenceError: reference to undefined property "backgroundsAlignment"[Learn More]  LightweightThemeConsumer.jsm:205:5
   ReferenceError: reference to undefined property "initialPageLoadedFromURLBar"[Learn More]  tabbrowser.xml:697:1
   ...
```
