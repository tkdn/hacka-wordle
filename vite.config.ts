import { dirname, relative } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import AutoImport from "unplugin-auto-import/vite";
import { pathResolve } from "utils";

export default defineConfig(({ command, mode }) => ({
  root: pathResolve("src"),
  resolve: {
    alias: {
      "@": `${pathResolve("src")}/`,
    },
  },
  base: command === "serve" ? "http://localhost:3000/" : "/dist/",
  build: {
    outDir: pathResolve("extension/dist"),
    emptyOutDir: false,
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        [mode]: pathResolve(`src/${mode}/index.html`),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  plugins: [
    mode === "popup" ? react() : null,
    AutoImport({
      imports: [
        {
          "webextension-polyfill": [["default", "browser"]],
        },
      ],
      dts: pathResolve("src/auto-imports.d.ts"),
    }),
    {
      name: "assets-rewrite",
      enforce: "post",
      apply: "build",
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), "/assets")}/`
        );
      },
    },
  ],
  optimizeDeps: {
    include: ["webextension-polyfill"],
  },
}));
