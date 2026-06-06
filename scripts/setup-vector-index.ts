import { prisma } from "@/lib/db/client";

async function main() {
  console.log("Enabling pgvector extension...");
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector`);

  console.log("Creating ivfflat index on KnowledgeChunk.embedding...");
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS knowledge_chunk_embedding_idx
      ON "KnowledgeChunk"
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)
  `);

  console.log("Vector index setup complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
