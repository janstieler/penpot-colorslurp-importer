penpot.ui.open("ColorSlurp Importer", `${import.meta.env.VITE_BASE_URL}/index.html?theme=${penpot.theme}`, { width: 400, height: 620 });

penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({ theme });
});

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

penpot.ui.onMessage((msg: any) => {
  if (msg.type === "check-colors") {
    const existing = penpot.library.local.colors.map(c => c.path ? `${c.path}/${c.name}` : c.name);
    penpot.ui.sendMessage({ type: "existing-colors", names: existing });
  }

  if (msg.type === "import-colors") {
    const { paletteName, colors, numberedPrefix } = msg as {
      paletteName: string;
      colors: { name: string; hex: string; alpha?: number }[];
      numberedPrefix: boolean;
    };
    if (typeof paletteName !== "string" || !Array.isArray(colors)) return;

    const existing = new Set(
      penpot.library.local.colors.map(c => c.path ? `${c.path}/${c.name}` : c.name)
    );
    const pad = String(colors.length).length;
    let added = 0, skipped = 0;

    colors.forEach((color, i) => {
      if (!HEX.test(color.hex)) return;
      const colorName = numberedPrefix
        ? `${String(i + 1).padStart(pad, "0")}_${color.name}`
        : color.name;
      const name = `${paletteName}/${colorName}`;
      if (existing.has(name)) { skipped++; return; }
      const c = penpot.library.local.createColor();
      c.name = name;
      c.color = color.hex;
      c.opacity = Math.min(1, Math.max(0, typeof color.alpha === "number" ? color.alpha : 1));
      added++;
    });

    penpot.ui.sendMessage({ type: "done", count: added, skipped });
  }
});
