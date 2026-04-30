import type { Translations } from "./types";

const de: Translations = {
    subtitle: "ColorSlurp JSON einfügen oder per Dragn ’n’ Drop ins Feld ziehen",
  placeholder: '{"name":"My Palette","colors":[{"name":"Primary","hex":"#3B82F6"}]}',
  statusWaiting: "Warte auf JSON…",
  btnNext: "Weiter →",
  btnBack: "← Zurück",
  btnSelectAll: "Alle auswählen",
  colorAssetsTitle: "Color Assets",
  colorAssetsDesc: "Farben direkt in die lokale Penpot Color Library importieren.",
  prefixLabel: "Reihenfolge beibehalten (nummerierten Präfix hinzufügen)",
  designTokensTitle: "Design Tokens",
  designTokensDesc: "Direkt in Penpots Token-System importieren sobald die Plugin-API verfügbar ist.",
  btnTokenImport: "Token-JSON importieren",
  errTooBig: "⚠ Eingabe zu groß (max. 512 KB)",
  errInvalidFormat: "Kein 'name' oder 'colors' Array gefunden",
  errTooManyColors: "Zu viele Farben (max. 2000)",
  colorsDetected: (n) => `✓ ${n} Farben erkannt`,
  checkingColors: "Prüfe bestehende Farben…",
  selectionCount: (s, total) => `${s} von ${total} Farben ausgewählt`,
  allExisting: "Alle Farben bereits vorhanden",
  noneSelected: "Keine Farben ausgewählt",
  importBtn: (n) => `${n} Farbe${n !== 1 ? "n" : ""} importieren`,
  alreadyExists: "bereits vorhanden",
  importing: "Importiere…",
  existingInfo: (n) => `${n} Farbe${n !== 1 ? "n" : ""} bereits vorhanden`,
  doneWithSkipped: (count, skipped) => `✅ ${count} importiert, ${skipped} übersprungen`,
  doneSimple: (count) => `✅ ${count} Farben importiert`,
};

export default de;
