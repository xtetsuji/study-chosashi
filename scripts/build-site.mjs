import { cp, rm, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");

await rm(output, { recursive: true, force: true });
await cp(
  resolve(root, "site"),
  output,
  {
    recursive: true,
    filter: (source) => basename(source) !== "README.md",
  },
);
await cp(
  resolve(root, "period-flashcards/dist"),
  resolve(output, "period-flashcards"),
  { recursive: true },
);
await writeFile(resolve(output, ".nojekyll"), "");

console.log(`GitHub Pages用ファイルを ${output} に生成しました。`);
