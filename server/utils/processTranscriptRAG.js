const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getEmbedding(text) {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return res.data[0].embedding;
}

async function processTranscriptRAG(transcript) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const docs = await splitter.createDocuments([transcript]);

  const finalChunks = [];

  for (const doc of docs) {
    const embedding = await getEmbedding(
      doc.pageContent
    );

    finalChunks.push({
      text: doc.pageContent,
      embedding,
      startTime: null,
      endTime: null,
    });
  }

  return finalChunks;
}

module.exports = processTranscriptRAG;