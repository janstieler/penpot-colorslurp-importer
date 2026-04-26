import "./style.css";

const i18n = {
  de: {
    title:      "ColorSlurp → Penpot",
    sub:        "ColorSlurp JSON einfügen oder hineinfallen lassen",
    btnImport:  "In Penpot importieren",
    btnCopy:    "Token-JSON kopieren",
    waiting:    "Warte auf JSON…",
    importing:  "Importiere…",
    copied:     "Token-JSON in Zwischenablage kopiert ✓",
    copyFailed: "Kopieren fehlgeschlagen",
    palette:    "Palette",
    colors:     "Farben",
    imported:   "Farben in Penpot Color Library importiert",
    errFormat:  "Kein 'name' oder 'colors' Array gefunden",
    recognized: "Farben erkannt",
  },
  en: {
    title:      "ColorSlurp → Penpot",
    sub:        "Paste or drop your ColorSlurp JSON here",
    btnImport:  "Import into Penpot",
    btnCopy:    "Copy Token JSON",
    waiting:    "Waiting for JSON…",
    importing:  "Importing…",
    copied:     "Token JSON copied to clipboard ✓",
    copyFailed: "Copy failed",
    palette:    "Palette",
    colors:     "colors",
    imported:   "colors imported into Penpot Color Library",
    errFormat:  "Missing 'name' or 'colors' array",
    recognized: "colors detected",
  },
};

type Lang = keyof typeof i18n;
type Color = { name: string; hex: string; alpha?: number };
type Palette = { name: string; colors: Color[] };

const browserLang = (navigator.language || "en").split("-")[0].toLowerCase() as Lang;
let t = i18n[browserLang] ?? i18n.en;
let parsed: Palette | null = null;
let tokenJson: Record<string, unknown> | null = null;

function applyTranslations(): void {
  (document.getElementById("i18n-title") as HTMLElement).textContent = t.title;
  (document.getElementById("i18n-sub") as HTMLElement).textContent   = t.sub;
  (document.getElementById("btnImport") as HTMLButtonElement).textContent = t.btnImport;
  (document.getElementById("btnCopy") as HTMLButtonElement).textContent   = t.btnCopy;
  setStatus(t.waiting, "info");
}

function setStatus(text: string, type: "info" | "success" | "error" = "info"): void {
  const el = document.getElementById("status") as HTMLElement;
  el.textContent = text;
  el.className = "status " + type;
}

function reset(): void {
  parsed = null;
  tokenJson = null;
  (document.getElementById("swatches") as HTMLElement).innerHTML = "";
  (document.getElementById("paletteName") as HTMLElement).innerHTML = "";
  (document.getElementById("tokenPreview") as HTMLElement).style.display = "none";
  (document.getElementById("btnImport") as HTMLButtonElement).disabled = true;
  (document.getElementById("btnCopy") as HTMLButtonElement).disabled = true;
}

function colorslurpToTokens(input: Palette): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  result[input.name] = Object.fromEntries(
    input.colors.map((c) => [c.name, { "$value": c.hex, "$type": "color", "$description": "" }])
  );
  result["$metadata"] = { tokenSetOrder: [input.name] };
  return result;
}

function stripTrailingCommas(str: string): string {
  return str.replace(/,\s*([}\]])/g, "$1");
}

function processJson(raw: string): void {
  reset();
  if (!raw.trim()) {
    setStatus(t.waiting, "info");
    (document.getElementById("input") as HTMLTextAreaElement).classList.remove("error");
    return;
  }
  try {
    const data = JSON.parse(stripTrailingCommas(raw));
    if (!data.name || !Array.isArray(data.colors)) {
      throw new Error(t.errFormat);
    }
    parsed = data as Palette;

    (document.getElementById("input") as HTMLTextAreaElement).classList.remove("error");

    const swatchRow = document.getElementById("swatches") as HTMLElement;
    parsed.colors.forEach((c) => {
      const el = document.createElement("div");
      el.className = "swatch";
      el.style.background = c.hex;
      el.title = `${c.name}: ${c.hex}`;
      swatchRow.appendChild(el);
    });

    const nameEl = document.getElementById("paletteName") as HTMLElement;
    nameEl.textContent = "";
    const strong = document.createElement("strong");
    strong.textContent = parsed.name;
    nameEl.append(`${t.palette}: `, strong, ` · ${parsed.colors.length} ${t.colors}`);

    tokenJson = colorslurpToTokens(parsed);
    const preview = document.getElementById("tokenPreview") as HTMLElement;
    preview.textContent = JSON.stringify(tokenJson, null, 2);
    preview.style.display = "block";

    (document.getElementById("btnImport") as HTMLButtonElement).disabled = false;
    (document.getElementById("btnCopy") as HTMLButtonElement).disabled = false;
    setStatus(`✓ ${parsed.colors.length} ${t.recognized}`, "success");

  } catch (err) {
    (document.getElementById("input") as HTMLTextAreaElement).classList.add("error");
    setStatus("⚠ " + (err as Error).message, "error");
  }
}

// ── Events ───────────────────────────────────────────────────────────────────
const textarea = document.getElementById("input") as HTMLTextAreaElement;

textarea.addEventListener("input", (e) => {
  processJson((e.target as HTMLTextAreaElement).value);
});

textarea.addEventListener("dragover", (e) => e.preventDefault());
textarea.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer?.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    textarea.value = ev.target?.result as string;
    processJson(textarea.value);
  };
  reader.readAsText(file);
});

(document.getElementById("btnImport") as HTMLButtonElement).addEventListener("click", () => {
  if (!parsed) return;
  (document.getElementById("btnImport") as HTMLButtonElement).disabled = true;
  setStatus(t.importing, "info");
  parent.postMessage({ type: "import-colors", paletteName: parsed.name, colors: parsed.colors }, "*");
});

(document.getElementById("btnCopy") as HTMLButtonElement).addEventListener("click", () => {
  if (!tokenJson) return;
  navigator.clipboard
    .writeText(JSON.stringify(tokenJson, null, 2))
    .then(() => setStatus(t.copied, "success"))
    .catch(() => setStatus(t.copyFailed, "error"));
});

// ── Penpot messages ───────────────────────────────────────────────────────────
window.addEventListener("message", (e: MessageEvent) => {
  const msg = e.data as { type: string; count?: number };
  if (msg.type === "done") {
    setStatus(`✅ ${msg.count ?? 0} ${t.imported}`, "success");
    (document.getElementById("btnImport") as HTMLButtonElement).disabled = false;
  }
});

applyTranslations();
