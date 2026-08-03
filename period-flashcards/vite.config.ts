import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pagesのサブディレクトリへ配置しても素材のURLが崩れないようにする。
  base: "./",
  plugins: [
    {
      name: "file-protocol-preview",
      apply: "build",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          // Viteの出力は単一バンドルで、通常のscriptとしても実行できる。
          // type=moduleを外し、file://で直接開いた場合のCORS制限を避ける。
          return html
            .replace(
              '<script type="module" crossorigin src=',
              '<script defer src=',
            )
            .replace('<link rel="stylesheet" crossorigin href=', '<link rel="stylesheet" href=');
        },
      },
    },
  ],
});
