penpot.ui.open("ColorSlurp Importer", "https://webdev.kdjfs.de/colorslurp-importer/index.html", { width: 400, height: 560 });

penpot.ui.onMessage((msg: { type: string }) => {
    if (msg.type === "get-library-colors") {
        const colors = penpot.library.local.colors.map((c) => ({ name: c.name }));
        penpot.ui.sendMessage({ type: "library-colors", colors });
    }

    if (msg.type === "import-colors") {
        const { colors } = msg as unknown as {
            colors: { name: string; hex: string; alpha: number }[];
        };

        for (const color of colors) {
            const c = penpot.library.local.createColor();
            c.name    = color.name;
            c.color   = color.hex;
            c.opacity = color.alpha;
        }

        penpot.ui.sendMessage({ type: "done", count: colors.length });
    }
});
