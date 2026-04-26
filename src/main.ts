import "./style.css";

const i18n = {
  de: {
    title:      "ColorSlurp → Penpot",
    sub:        "ColorSlurp JSON einfügen oder hineinfallen lassen",
    btnNext:    "Weiter →",
    btnImport:  "Importieren",
    waiting:    "Warte auf JSON…",
    importing:  "Importiere…",
    palette:    "Palette",
    colors:     "Farben",
    selected:   "ausgewählt",
    imported:   "Farben importiert",
    errFormat:  "Kein 'name' oder 'colors'-Array gefunden",
    recognized: "Farben erkannt",
    duplicate:  "bereits vorhanden",
    prefix:     "Nummerierter Präfix (z. B. 01_Name)",
    noneSelected: "Keine Farben ausgewählt",
  },
  en: {
    title:      "ColorSlurp → Penpot",
    sub:        "Paste or drop your ColorSlurp JSON here",
    btnNext:    "Continue →",
    btnImport:  "Import",
    waiting:    "Waiting for JSON…",
    importing:  "Importing…",
    palette:    "Palette",
    colors:     "colors",
    selected:   "selected",
    imported:   "colors imported",
    errFormat:  "Missing 'name' or 'colors' array",
    recognized: "colors detected",
    duplicate:  "already in library",
    prefix:     "Numbered prefix (e.g. 01_Name)",
    noneSelected: "No colors selected",
  },
};

type Lang = keyof typeof i18n;
type Color = { name: string; hex: string; alpha?: number };
type Palette = { name: string; colors: Color[] };

const browserLang = (navigator.language || "en").split("-")[0].toLowerCase() as Lang;
const t = i18n[browserLang] ?? i18n.en;

let parsed: Palette | null = null;
let libraryColorNames: Set<string> = new Set();
let selectedIndices: Set<number> = new Set();

// ── Helpers ───────────────────────────────────────────────────────────────────

function setStatus(id: string, text: string, type: "info" | "success" | "error" = "info"): void {
  const el = document.getElementById(id) as HTMLElement;
  el.textContent = text;
  el.className = "status " + type;
}

function showStep(step: 1 | 2): void {
  (document.getElementById("step1") as HTMLElement).style.display = step === 1 ? "" : "none";
  (document.getElementById("step2") as HTMLElement).style.display = step === 2 ? "" : "none";
}

function stripTrailingCommas(str: string): string {
  return str.replace(/,\s*([}\]])/g, "$1");
}

function fullColorName(paletteName: string, colorName: string, index: number, usePrefix: boolean): string {
  const prefix = usePrefix ? `${String(index + 1).padStart(2, "0")}_` : "";
  return `${paletteName}/${prefix}${colorName}`;
}

// ── Step 2: render swatches ───────────────────────────────────────────────────

function renderSwatches(): void {
  if (!parsed) return;

  const usePrefix = (document.getElementById("usePrefix") as HTMLInputElement).checked;
  const grid = document.getElementById("swatches") as HTMLElement;
  grid.innerHTML = "";
  selectedIndices.clear();

  parsed.colors.forEach((c, i) => {
    const name = fullColorName(parsed!.name, c.name, i, usePrefix);
    const isDuplicate = libraryColorNames.has(name);

    const wrapper = document.createElement("div");
    wrapper.className = "swatch-wrapper" + (isDuplicate ? " duplicate" : " selected");
    if (!isDuplicate) selectedIndices.add(i);

    const dot = document.createElement("div");
    dot.className = "swatch";
    dot.style.background = c.hex;
    dot.title = `${c.name}: ${c.hex}${isDuplicate ? ` (${t.duplicate})` : ""}`;

    if (!isDuplicate) {
      wrapper.addEventListener("click", () => {
        const isSelected = wrapper.classList.toggle("selected");
        if (isSelected) {
          selectedIndices.add(i);
        } else {
          selectedIndices.delete(i);
        }
        updateImportButton();
      });
    }

    wrapper.appendChild(dot);
    grid.appendChild(wrapper);
  });

  updateImportButton();
}

function updateImportButton(): void {
  const count = selectedIndices.size;
  const btn = document.getElementById("btnImport") as HTMLButtonElement;
  btn.disabled = count === 0;
  if (count === 0) {
    setStatus("status2", t.noneSelected, "info");
  } else {
    setStatus("status2", `${count} ${t.colors} ${t.selected}`, "info");
  }
}

// ── Step 1: JSON parsing ──────────────────────────────────────────────────────

function parseJson(raw: string): void {
  if (!raw.trim()) {
    setStatus("status1", t.waiting, "info");
    (document.getElementById("input") as HTMLTextAreaElement).classList.remove("error");
    (document.getElementById("btnNext") as HTMLButtonElement).disabled = true;
    parsed = null;
    return;
  }
  try {
    const data = JSON.parse(stripTrailingCommas(raw));
    if (!data.name || !Array.isArray(data.colors)) throw new Error(t.errFormat);
    parsed = data as Palette;
    (document.getElementById("input") as HTMLTextAreaElement).classList.remove("error");
    setStatus("status1", `✓ ${parsed.colors.length} ${t.recognized}`, "success");
    (document.getElementById("btnNext") as HTMLButtonElement).disabled = false;
  } catch (err) {
    (document.getElementById("input") as HTMLTextAreaElement).classList.add("error");
    setStatus("status1", "⚠ " + (err as Error).message, "error");
    (document.getElementById("btnNext") as HTMLButtonElement).disabled = true;
    parsed = null;
  }
}

// ── Events: Step 1 ───────────────────────────────────────────────────────────

const textarea = document.getElementById("input") as HTMLTextAreaElement;

textarea.addEventListener("input", (e) => {
  parseJson((e.target as HTMLTextAreaElement).value);
});

textarea.addEventListener("dragover", (e) => e.preventDefault());
textarea.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer?.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    textarea.value = ev.target?.result as string;
    parseJson(textarea.value);
  };
  reader.readAsText(file);
});

(document.getElementById("btnNext") as HTMLButtonElement).addEventListener("click", () => {
  if (!parsed) return;
  parent.postMessage({ type: "get-library-colors" }, "*");
});

// ── Events: Step 2 ───────────────────────────────────────────────────────────

(document.getElementById("btnBack") as HTMLButtonElement).addEventListener("click", () => {
  showStep(1);
});

(document.getElementById("usePrefix") as HTMLInputElement).addEventListener("change", () => {
  renderSwatches();
});

(document.getElementById("btnImport") as HTMLButtonElement).addEventListener("click", () => {
  if (!parsed || selectedIndices.size === 0) return;

  const usePrefix = (document.getElementById("usePrefix") as HTMLInputElement).checked;
  const colors = Array.from(selectedIndices).map((i) => {
    const c = parsed!.colors[i];
    return {
      name: fullColorName(parsed!.name, c.name, i, usePrefix),
      hex: c.hex,
      alpha: c.alpha ?? 1,
    };
  });

  (document.getElementById("btnImport") as HTMLButtonElement).disabled = true;
  setStatus("status2", t.importing, "info");
  parent.postMessage({ type: "import-colors", colors }, "*");
});

// ── Penpot messages ───────────────────────────────────────────────────────────

window.addEventListener("message", (e: MessageEvent) => {
  const msg = e.data as { type: string; count?: number; colors?: { name: string }[] };

  if (msg.type === "library-colors") {
    libraryColorNames = new Set((msg.colors ?? []).map((c) => c.name));

    const nameEl = document.getElementById("paletteName") as HTMLElement;
    nameEl.textContent = "";
    const strong = document.createElement("strong");
    strong.textContent = parsed!.name;
    nameEl.append(`${t.palette}: `, strong, ` · ${parsed!.colors.length} ${t.colors}`);

    renderSwatches();
    showStep(2);
  }

  if (msg.type === "done") {
    setStatus("status2", `✅ ${msg.count ?? 0} ${t.imported}`, "success");
    (document.getElementById("btnImport") as HTMLButtonElement).disabled = false;
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────

function applyTranslations(): void {
  (document.getElementById("i18n-title") as HTMLElement).textContent  = t.title;
  (document.getElementById("i18n-sub") as HTMLElement).textContent    = t.sub;
  (document.getElementById("btnNext") as HTMLButtonElement).textContent   = t.btnNext;
  (document.getElementById("btnImport") as HTMLButtonElement).textContent = t.btnImport;
  (document.getElementById("i18n-prefix") as HTMLElement).textContent = t.prefix;
  setStatus("status1", t.waiting, "info");
}

applyTranslations();
