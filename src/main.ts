import "./style.css";

// ── Theme ────────────────────────────────────────────────────────────────
const urlTheme = new URLSearchParams(window.location.search).get("theme");
const darkMq = window.matchMedia("(prefers-color-scheme: dark)");
document.body.dataset["theme"] = urlTheme ?? (darkMq.matches ? "dark" : "light");
darkMq.addEventListener("change", (e) => {
  document.body.dataset["theme"] = e.matches ? "dark" : "light";
});

type Color = { name: string; hex: string; alpha?: number };
type Palette = { name: string; colors: Color[] };

const MAX_INPUT_BYTES = 512 * 1024;

let parsed: Palette | null = null;
let existingColorNames = new Set<string>();
let selectedColors = new Set<string>();

function stripTrailingCommas(str: string): string {
  return str.replace(/,\s*([}\]])/g, "$1");
}

function setStatus1(text: string, type: "info" | "success" | "error" = "info"): void {
  const el = document.getElementById("status1") as HTMLElement;
  el.textContent = text;
  el.className = "status " + type;
}

function setStatus2(text: string, type: "info" | "success" | "error" = "info"): void {
  const el = document.getElementById("status2") as HTMLElement;
  el.textContent = text;
  el.className = "result-status " + type;
}

function showScreen2(): void {
  const s1 = document.getElementById("screen1") as HTMLElement;
  const s2 = document.getElementById("screen2") as HTMLElement;
  s2.classList.remove("hidden");
  s2.classList.add("slide-in");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      s1.classList.add("hidden");
      s2.classList.remove("slide-in");
    });
  });
}

function showScreen1(): void {
  const s1 = document.getElementById("screen1") as HTMLElement;
  const s2 = document.getElementById("screen2") as HTMLElement;
  s1.classList.remove("hidden");
  s2.classList.add("hidden");
  setStatus2("");
}

// ── Input handling ───────────────────────────────────────────────────────
const inputEl = document.getElementById("input") as HTMLTextAreaElement;

function processInput(raw: string): void {
  parsed = null;
  (document.getElementById("btnAnalyze") as HTMLButtonElement).disabled = true;
  inputEl.classList.remove("error");

  if (!raw.trim()) { setStatus1("Warte auf JSON…", "info"); return; }
  if (raw.length > MAX_INPUT_BYTES) {
    inputEl.classList.add("error");
    setStatus1("⚠ Eingabe zu groß (max. 512 KB)", "error");
    return;
  }

  try {
    parsed = JSON.parse(stripTrailingCommas(raw)) as Palette;
    if (!parsed.name || !Array.isArray(parsed.colors)) throw new Error("Kein 'name' oder 'colors' Array gefunden");
    if (parsed.colors.length > 2000) throw new Error("Zu viele Farben (max. 2000)");
    setStatus1(`✓ ${parsed.colors.length} Farben erkannt`, "success");
    (document.getElementById("btnAnalyze") as HTMLButtonElement).disabled = false;
  } catch (e) {
    inputEl.classList.add("error");
    setStatus1("⚠ " + (e as Error).message, "error");
  }
}

inputEl.addEventListener("input", (e) => processInput((e.target as HTMLTextAreaElement).value));

inputEl.addEventListener("dragover", (e) => e.preventDefault());
inputEl.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer?.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    inputEl.value = ev.target?.result as string;
    processInput(inputEl.value);
  };
  reader.readAsText(file);
});

// ── Screen 2 ────────────────────────────────────────────────────────────
function updateImportButton(): void {
  if (!parsed) return;
  const btn = document.getElementById("btnImportColors") as HTMLButtonElement;
  const count = selectedColors.size;
  const total = parsed.colors.length;
  (document.getElementById("paletteCount") as HTMLElement).textContent = `${count} von ${total} Farben ausgewählt`;
  if (count === 0) {
    btn.textContent = parsed.colors.every(c => existingColorNames.has(`${parsed!.name}/${c.name}`))
      ? "Alle Farben bereits vorhanden"
      : "Keine Farben ausgewählt";
    btn.disabled = true;
  } else {
    btn.textContent = `${count} Farbe${count !== 1 ? "n" : ""} importieren`;
    btn.disabled = false;
  }
}

function renderSwatches(): void {
  if (!parsed) return;
  const grid = document.getElementById("swatches") as HTMLElement;
  grid.innerHTML = "";
  parsed.colors.forEach((c) => {
    const fullName = `${parsed!.name}/${c.name}`;
    const exists = existingColorNames.has(fullName);
    const el = document.createElement("div");

    if (exists) {
      el.className = "swatch exists";
      el.title = `${c.name} (bereits vorhanden)`;
    } else {
      const selected = selectedColors.has(fullName);
      el.className = "swatch new" + (selected ? "" : " deselected");
      el.title = c.name;
      el.addEventListener("click", () => {
        if (selectedColors.has(fullName)) {
          selectedColors.delete(fullName);
        } else {
          selectedColors.add(fullName);
        }
        el.classList.toggle("deselected");
        updateImportButton();
      });
    }

    el.style.background = c.hex;
    grid.appendChild(el);
  });
}

(document.getElementById("btnAnalyze") as HTMLButtonElement).addEventListener("click", () => {
  if (!parsed) return;
  (document.getElementById("paletteName") as HTMLElement).textContent = parsed.name;
  (document.getElementById("paletteCount") as HTMLElement).textContent = `${parsed.colors.length} Farben`;

  existingColorNames = new Set();
  selectedColors = new Set(parsed.colors.map(c => `${parsed!.name}/${c.name}`));
  renderSwatches();
  updateImportButton();
  setStatus2("Prüfe bestehende Farben…", "info");
  showScreen2();

  parent.postMessage({ type: "check-colors" }, "*");
});

(document.getElementById("btnBack") as HTMLButtonElement).addEventListener("click", showScreen1);

(document.getElementById("btnSelectAll") as HTMLButtonElement).addEventListener("click", () => {
  if (!parsed) return;
  parsed.colors.forEach(c => {
    const fullName = `${parsed!.name}/${c.name}`;
    if (!existingColorNames.has(fullName)) selectedColors.add(fullName);
  });
  renderSwatches();
  updateImportButton();
});

(document.getElementById("btnImportColors") as HTMLButtonElement).addEventListener("click", () => {
  if (!parsed || selectedColors.size === 0) return;
  const colors = parsed.colors.filter(c => selectedColors.has(`${parsed!.name}/${c.name}`));
  const numberedPrefix = (document.getElementById("chkPrefix") as HTMLInputElement).checked;
  (document.getElementById("btnImportColors") as HTMLButtonElement).disabled = true;
  setStatus2("Importiere…", "info");
  parent.postMessage({ type: "import-colors", paletteName: parsed.name, colors, numberedPrefix }, "*");
});

// ── Penpot messages ──────────────────────────────────────────────────────
window.addEventListener("message", (e: MessageEvent) => {
  if (e.source !== window.parent) return;
  if (e.data?.theme && !e.data?.type) {
    document.body.dataset["theme"] = e.data.theme;
    return;
  }
  const msg = e.data as { type: string; names?: string[]; count?: number; skipped?: number };

  if (msg.type === "existing-colors" && msg.names) {
    // Strip numbered prefix ("01_", "18_") from color name part for duplicate matching
    existingColorNames = new Set(msg.names.map(n => n.replace(/^(.+\/)(\d+_)/, "$1")));
    if (parsed) {
      parsed.colors.forEach(c => {
        if (existingColorNames.has(`${parsed!.name}/${c.name}`)) selectedColors.delete(`${parsed!.name}/${c.name}`);
      });
      const skipped = parsed.colors.filter(c => existingColorNames.has(`${parsed!.name}/${c.name}`)).length;
      setStatus2(skipped > 0 ? `${skipped} Farbe${skipped !== 1 ? "n" : ""} bereits vorhanden` : "", "info");
    }
    renderSwatches();
    updateImportButton();
  }

  if (msg.type === "done") {
    const text = (msg.skipped ?? 0) > 0
      ? `✅ ${msg.count} importiert, ${msg.skipped} übersprungen`
      : `✅ ${msg.count} Farben importiert`;
    setStatus2(text, "success");
    if (parsed) {
      existingColorNames = new Set([...existingColorNames, ...parsed.colors.map(c => `${parsed!.name}/${c.name}`)]);
    }
    renderSwatches();
    updateImportButton();
  }
});
