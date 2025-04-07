import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

if (!process.env.PINECONE_API_KEY) throw new Error("Missing PINECONE_API_KEY");
if (!process.env.PINECONE_INDEX_NAME)
  throw new Error("Missing PINECONE_INDEX_NAME");
if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

const pinecone = new Pinecone();

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-small",
});

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
});

export interface VectorMetadata {
  userId: string;
  resourceId: string;
  type: "link" | "note";
  title: string;
  tags: string[];
  url?: string;
  content?: string;
}

export async function upsertToPinecone({
  userId,
  resourceId,
  type,
  title,
  tags,
  url,
  content,
}: VectorMetadata) {
  const textToEmbed = `${title} ${tags.join(" ")} ${content || ""} ${
    url || ""
  }`;
  const vector = await embeddings.embedQuery(textToEmbed);

  await pineconeIndex.upsert([
    {
      id: resourceId,
      values: vector,
      metadata: {
        userId,
        resourceId,
        type,
        title,
        tags,
        url: url || "",
        content: content || "",
      },
    },
  ]);
}

export async function searchPinecone({
  query,
  userId,
  resourceId,
}: {
  query: string;
  userId: string;
  resourceId?: string;
}) {
  const metadataFilter: Record<string, any> = { userId: userId };
  if (resourceId) metadataFilter.resourceId = resourceId;

  const results = await vectorStore.similaritySearchWithScore(
    query,
    5,
    metadataFilter
  );

  const filteredResults = results
    .filter(([_, score]) => score > 0.5)
    .map(([doc]) => doc);

  return filteredResults;
}

export async function deleteFromPinecone(resourceId: string) {
  await pineconeIndex.deleteOne(resourceId);
}
