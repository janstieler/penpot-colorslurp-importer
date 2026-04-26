# ColorSlurp Importer für Penpot

[![Badge](https://forthebadge.com/api/badges/generate?primaryLabel=Lang&secondaryLabel=EN&primaryBGColor=%23555555&secondaryBGColor=%23D05A45)](https://github.com/janstieler/penpot-colorslurp-importer/blob/main/README.md)

Ein [Penpot](https://penpot.app)-Plugin, das [ColorSlurp](https://colorslurp.com)-Farbpaletten direkt in die lokale Farbbibliothek von Penpot importiert.

## Funktionen

- ColorSlurp-JSON-Export einfügen oder per Drag & Drop laden
- Alle Farben als Swatches vor dem Import in der Vorschau ansehen
- Duplikaterkennung — bereits importierte Farben werden markiert und automatisch abgewählt
- Auswählbare Swatches — genau festlegen, welche Farben importiert werden sollen
- Optionaler nummerierter Präfix, um die ursprüngliche Palettenreihenfolge beizubehalten (z. B. `01_Himmel`, `02_Ozean`)
- Hell- und Dunkel-Theme folgt der Penpot-Einstellung
- Keine externen Abhängigkeiten zur Laufzeit

## Installation

1. Eine beliebige Datei in Penpot öffnen
2. Mit `Ctrl + Alt + P` den Plugin-Manager öffnen
3. Die Manifest-URL eingeben:
   ```
   https://webdev.kdjfs.de/colorslurp-importer/manifest.json
   ```
4. Auf **Installieren** klicken — das Plugin steht ab sofort in Penpot zur Verfügung

## Verwendung

### 1. Export aus ColorSlurp

In ColorSlurp die gewünschte Palette öffnen und als **JSON** exportieren. Die Datei hat folgendes Format:

```json
{
  "name": "Meine Palette",
  "colors": [
    { "name": "Himmel", "hex": "#87CEEB", "alpha": 1 },
    { "name": "Ozean", "hex": "#006994", "alpha": 1 }
  ]
}
```

### 2. Import in Penpot

1. Das Plugin in Penpot öffnen
2. Das JSON einfügen oder die `.json`-Datei in das Textfeld ziehen
3. Auf **Weiter →** klicken, um die Farbswatches zu sehen
4. Farben, die bereits in der Bibliothek vorhanden sind, werden ausgegraut und abgewählt
5. Optional **nummerierten Präfix** aktivieren, um die Palettenreihenfolge in Penpot zu erhalten
6. Gewünschte Farben auswählen und auf **Importieren** klicken

## Entwicklung

### Voraussetzungen

- Node.js 18+
- npm

### Einrichtung

```bash
git clone https://github.com/janstieler/penpot-colorslurp-importer
cd penpot-colorslurp-importer
npm install
```

### Entwicklungsserver

```bash
npm run dev
```

Die Plugin-UI ist unter `http://localhost:4400` erreichbar. In Penpot laden über:
```
http://localhost:4400/manifest.json
```

### Build

```bash
npm run build
```

Die Ausgabe liegt in `dist/`.

### Self-Hosting

Den Inhalt von `dist/` auf einem beliebigen Webserver bereitstellen. `host` in `public/manifest.json` und `penpot.ui.open(...)` in `src/plugin.ts` auf die eigene Domain anpassen und danach neu bauen.

## Berechtigungen

Das Plugin benötigt folgende Penpot-Berechtigungen:

| Berechtigung | Grund |
|---|---|
| `library:read` | Bereits importierte Farben erkennen |
| `library:write` | Neue Farben zur lokalen Bibliothek hinzufügen |
| `user:read` | Aktuelles UI-Theme auslesen |

## Lizenz

MIT — © 2026 [Jan-Frederik Stieler](https://www.janstieler.de)
