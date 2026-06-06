import { readFile } from "fs/promises";
import path from "path";

import { CATEGORY_LABELS } from "@/lib/data/categories";
import type { MenuItem } from "@/lib/data/menu";
import type { KnowledgeChunkInput, KnowledgeSource } from "@/lib/knowledge/types";

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function chunkMenuItem(item: MenuItem): KnowledgeChunkInput {
  const prepNotes =
    item.prepNotes.length > 0 ? item.prepNotes.join(", ") : "N/A";

  const content = `${item.name}. ${item.longDescription} Category: ${CATEGORY_LABELS[item.category]}. Diet: ${item.diet}. Price: ₹${item.price}. Prep notes: ${prepNotes}.${item.servingSize ? ` Serving: ${item.servingSize}.` : ""}${item.spiceLevel ? ` Spice level: ${item.spiceLevel}/3.` : ""}`;

  return {
    source: "menu",
    sourceRef: item.slug,
    title: item.name,
    content,
    metadata: {
      price: item.price,
      category: item.category,
      diet: item.diet,
      slug: item.slug,
      isAvailable: item.isAvailable,
    },
  };
}

export function chunkMdxByHeadings(
  raw: string,
  source: KnowledgeSource,
  sourcePrefix: string,
): KnowledgeChunkInput[] {
  const lines = raw.split("\n");
  const chunks: KnowledgeChunkInput[] = [];
  let currentTitle = "";
  let currentLines: string[] = [];
  let index = 0;

  function flush() {
    const body = currentLines.join("\n").trim();
    if (!currentTitle || !body) {
      return;
    }

    const sourceRef = `${sourcePrefix}-${slugifyHeading(currentTitle) || String(index)}`;
    chunks.push({
      source,
      sourceRef,
      title: currentTitle,
      content: `${currentTitle}. ${body}`,
      metadata: { section: currentTitle },
    });
    index += 1;
  }

  for (const line of lines) {
    if (line.startsWith("# ")) {
      continue;
    }

    if (line.startsWith("## ")) {
      flush();
      currentTitle = line.replace(/^##\s+/, "").trim();
      currentLines = [];
      continue;
    }

    if (currentTitle) {
      currentLines.push(line);
    }
  }

  flush();
  return chunks;
}

export async function loadMdxChunks(
  filename: string,
  source: KnowledgeSource,
  sourcePrefix: string,
): Promise<KnowledgeChunkInput[]> {
  const filePath = path.join(process.cwd(), "content", filename);
  const raw = await readFile(filePath, "utf-8");
  return chunkMdxByHeadings(raw, source, sourcePrefix);
}
