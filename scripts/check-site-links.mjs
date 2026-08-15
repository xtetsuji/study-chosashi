import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(repositoryRoot, "dist");

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectHtmlFiles(entryPath));
    } else if (entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files;
}

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function resolveLocalReference(htmlFile, reference) {
  const cleanReference = reference.split(/[?#]/, 1)[0];
  if (!cleanReference) return null;

  return reference.startsWith("/")
    ? path.join(siteRoot, cleanReference)
    : path.resolve(path.dirname(htmlFile), cleanReference);
}

const htmlFiles = await collectHtmlFiles(siteRoot);
const missingReferences = [];

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, "utf8");
  const references = html.matchAll(/(?:href|src)=["']([^"']+)["']/g);

  for (const match of references) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|data:|#)/.test(reference)) continue;

    const target = resolveLocalReference(htmlFile, reference);
    if (!target) continue;

    if (!await exists(target) && !await exists(path.join(target, "index.html"))) {
      missingReferences.push(
        `${path.relative(siteRoot, htmlFile)}: ${reference}`,
      );
    }
  }
}

if (missingReferences.length > 0) {
  console.error("生成サイトに存在しないリンクまたは読込先があります。");
  console.error(missingReferences.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`生成HTML ${htmlFiles.length}件の内部リンクを確認しました。`);
}
