# ColorSlurp Importer for Penpot

![headerimage](headerimage.jpg)

[![Badge](https://forthebadge.com/api/badges/generate?primaryLabel=Lang&secondaryLabel=DE&primaryBGColor=%23555555&secondaryBGColor=%23D2AA26)](https://github.com/janstieler/penpot-colorslurp-importer/blob/main/README.de.md)

Bring your color palettes from [ColorSlurp](https://colorslurp.com) into [Penpot](https://penpot.app) in seconds. Export your palette as JSON in ColorSlurp, paste or drop it into the plugin, pick the colors you want — and import them directly into your local color library.

## Features

- Paste or drop a ColorSlurp JSON export into the plugin
- Preview all colors as swatches before importing
- Duplicate detection — already imported colors are marked and deselected automatically
- Selectable swatches — choose exactly which colors to import
- Optional numbered prefix to preserve the original palette order (e.g. `01_Sky`, `02_Ocean`)
- Light and dark theme, follows Penpot's UI setting
- Available in English and German — auto-detected from your browser or Penpot locale, switchable via the globe icon
- No external dependencies at runtime

## Installation

1. Open any file in Penpot
2. Press `Ctrl + Alt + P` to open the Plugin Manager
3. Enter the manifest URL:
   ```
   https://janstieler.github.io/penpot-colorslurp-importer/manifest.json
   ```
4. Click **Install** — the plugin is now available in Penpot

## Usage

### 1. Export from ColorSlurp

In ColorSlurp, open your palette and export it as **JSON**. The file looks like this:

```json
{
  "name": "My Palette",
  "colors": [
    { "name": "Sky", "hex": "#87CEEB", "alpha": 1 },
    { "name": "Ocean", "hex": "#006994", "alpha": 1 }
  ]
}
```

### 2. Import into Penpot

1. Open the plugin in Penpot
2. Paste the JSON or drag and drop the `.json` file into the text area
3. Click **Next →** to see the color swatches
4. Colors already present in your library are greyed out and deselected
5. Optionally enable **numbered prefix** to keep the palette order intact in Penpot
6. Select the colors you want and click **Import**

### Language

The plugin is available in **English** and **German**. The language is auto-detected from your browser locale or Penpot's language setting. Use the globe icon in the bottom-right footer to switch manually — your choice is saved for future sessions.

## Development

### Requirements

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/janstieler/penpot-colorslurp-importer
cd penpot-colorslurp-importer
npm install
```

### Dev server

```bash
npm run dev
```

The plugin UI is served at `http://localhost:4400`. Load it in Penpot via your local server's manifest URL, e.g.:
```
http://localhost:4400/manifest.json
```

### Build

```bash
npm run build
```

Output goes to `dist/`.

### Self-hosting

Deploy the contents of `dist/` to any static web server. Set `VITE_BASE_URL` in `.env.production` to your domain and run `npm run build`.

## Permissions

The plugin requests the following Penpot permissions:

| Permission | Reason |
|---|---|
| `content:read` | Required for Penpot event listeners (theme change) |
| `library:read` | Check for already imported colors |
| `library:write` | Add new colors to the local library |

## Support
If you want to support me [buymeacoffee.com/janstieler](buymeacoffee.com/janstieler).

## License

MIT — © 2026 [Jan-Frederik Stieler](https://www.janstieler.de)
