import type { Translations } from "./types";

const en: Translations = {
  subtitle: "Paste or drop a ColorSlurp JSON",
  placeholder: '{"name":"My Palette","colors":[{"name":"Primary","hex":"#3B82F6"}]}',
  statusWaiting: "Waiting for JSON…",
  btnNext: "Next →",
  btnBack: "← Back",
  btnSelectAll: "Select all",
  colorAssetsTitle: "Color Assets",
  colorAssetsDesc: "Import colors directly into Penpot's local color library.",
  prefixLabel: "Preserve order (add numbered prefix)",
  designTokensTitle: "Design Tokens",
  designTokensDesc: "Import directly into Penpot's token system once the plugin API is available.",
  btnTokenImport: "Import Token JSON",
  errTooBig: "⚠ Input too large (max. 512 KB)",
  errInvalidFormat: "No 'name' or 'colors' array found",
  errTooManyColors: "Too many colors (max. 2000)",
  colorsDetected: (n) => `✓ ${n} color${n !== 1 ? "s" : ""} detected`,
  checkingColors: "Checking existing colors…",
  selectionCount: (s, total) => `${s} of ${total} colors selected`,
  allExisting: "All colors already exist",
  noneSelected: "No colors selected",
  importBtn: (n) => `Import ${n} color${n !== 1 ? "s" : ""}`,
  alreadyExists: "already exists",
  importing: "Importing…",
  existingInfo: (n) => `${n} color${n !== 1 ? "s" : ""} already exist`,
  doneWithSkipped: (count, skipped) => `✅ ${count} imported, ${skipped} skipped`,
  doneSimple: (count) => `✅ ${count} colors imported`,
};

export default en;
