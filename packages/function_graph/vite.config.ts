import { defineConfig, Plugin } from "vite";

import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ command }) => {
  return {
    plugins: [
      createHtmlPlugin({
        minify: false,
        /**
         * After writing entry here, you will not need to add script tags in `index.html`, the original tags need to be deleted
         */
        entry: command === "serve" ? "/src/main_dev.ts" : "/src/main_prod.ts",
        /**
         * If you want to store `index.html` in the specified folder, you can modify it, otherwise no configuration is required
         * @default index.html
         */
        template: "public/index.html",

        /**
         * Data that needs to be injected into the index.html ejs template
         */
        inject: command === "serve" ? {} : {
          tags: [
            {
              injectTo: "head-prepend",
              tag: "meta",
              attrs: {
                'http-equiv': 'Content-Security-Policy',
                'content': "default-src self; img-src vscode-resource:; script-src vscode-resource: 'self' 'unsafe-inline'; style-src vscode-resource: 'self' 'unsafe-inline';"
              },
            },
          ],
        },
      }),
    ],
  };
});
