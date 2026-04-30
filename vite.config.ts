import { writeFileSync } from "fs";
import { resolve } from "path";
import { defineConfig, type Plugin } from "vite";
import livePreview from "vite-live-preview";

function penpotManifestPlugin(): Plugin {
  let basePath: string;
  return {
    name: "penpot-manifest",
    configResolved(config) {
      basePath = new URL(config.env["VITE_BASE_URL"]).pathname;
    },
    writeBundle() {
      const manifest = {
        name: "ColorSlurp Importer",
        description: "Importiert ColorSlurp-Paletten in die Penpot Color Library",
        code: `${basePath}/plugin.js`,
        icon: `${basePath}/icon.png`,
        permissions: ["content:read", "library:read", "library:write"],
      };
      writeFileSync(
        resolve(__dirname, "dist/manifest.json"),
        JSON.stringify(manifest, null, 2),
      );
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [
    livePreview({
      reload: true,
      config: {
        build: {
          sourcemap: true,
        },
      },
    }),
    penpotManifestPlugin(),
  ],
  build: {
    rollupOptions: {
      input: {
        plugin: "src/plugin.ts",
        index: "./index.html",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  preview: {
    port: 5000,
    cors: true,
  },
});
