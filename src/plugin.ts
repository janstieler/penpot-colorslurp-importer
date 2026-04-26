penpot.ui.open("ColorSlurp Importer", "https://webdev.kdjfs.de/colorslurp-importer/index.html", { width: 400, height: 520 });

penpot.ui.onMessage((msg: any) => {
    if (msg.type === "import-colors") {
        const { paletteName, colors } = msg as {
            paletteName: string;
            colors: { name: string; hex: string; alpha?: number }[];
        };

        let count = 0;

        for (const color of colors) {
            const c = penpot.library.local.createColor();
            c.name = `${paletteName}/${color.name}`;
            c.color = color.hex;
            c.opacity = color.alpha ?? 1;
            count++;
        }

        penpot.ui.sendMessage({ type: "done", count });
    }
});