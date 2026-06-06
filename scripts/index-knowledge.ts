import { prisma } from "@/lib/db/client";
import { indexAllKnowledge } from "@/lib/knowledge/indexer";

async function main() {
  console.log("Starting knowledge indexing...");

  const result = await indexAllKnowledge();

  console.log(`Indexed menu chunks: ${result.menu}`);
  console.log(`Indexed FAQ chunks: ${result.faq}`);
  console.log(`Indexed about chunks: ${result.about}`);
  console.log(`Indexed policy chunks: ${result.policy}`);
  console.log(`Total chunks indexed: ${result.total}`);
  console.log("Knowledge indexing complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
