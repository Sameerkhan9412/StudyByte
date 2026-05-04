// utils/embedding.js

const { pipeline } = require("@xenova/transformers");
const OpenAI = require("openai");

let extractor = null;
let openai = null;

// Detect environment
const useAPI =
  process.env.USE_EMBEDDING_API === "true" &&
  process.env.OPENAI_API_KEY;

// ------------------------------------
// INIT API (Production)
// ------------------------------------
function initOpenAI() { 
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}

// ------------------------------------
// INIT LOCAL MODEL (Development)
// ------------------------------------
async function initLocalModel() {
  if (!extractor) {
    console.log("🔄 Loading local embedding model...");
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    console.log("✅ Local model loaded");
  }
}

// ------------------------------------
// SINGLE EMBEDDING
// ------------------------------------
async function getEmbedding(text) {
  // ✅ PRODUCTION → API
  if (useAPI) {
    initOpenAI();

    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return res.data[0].embedding;
  }

  // ✅ DEVELOPMENT → LOCAL
  await initLocalModel();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}

// ------------------------------------
// BATCH EMBEDDING
// ------------------------------------
async function getEmbeddingsBatch(texts) {
  // ✅ PRODUCTION → API (batch supported)
  if (useAPI) {
    initOpenAI();

    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });

    return res.data.map((item) => item.embedding);
  }

  // ✅ DEVELOPMENT → LOCAL (loop)
  await initLocalModel();

  const embeddings = [];

  for (const text of texts) {
    const output = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });

    embeddings.push(Array.from(output.data));
  }

  return embeddings;
}

module.exports = {
  getEmbedding,
  getEmbeddingsBatch,
};