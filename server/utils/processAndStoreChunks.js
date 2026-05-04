// utils/processAndStoreChunks.js

const LectureChunk = require("../models/LectureChunk");
const { getEmbeddingsBatch } = require("./embedding");

function splitText(text, chunkSize = 500, overlap = 100) {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks = [];

  let start = 0;

  while (start < clean.length) {
    const end = start + chunkSize;
    chunks.push(clean.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

async function processAndStoreChunks(subSectionId, transcript) {
  try {
    await LectureChunk.deleteMany({ subSectionId });

    const texts = splitText(transcript);
    console.log("this is chunking",texts);
    const embeddings = await getEmbeddingsBatch(texts);

    const docs = texts.map((text, i) => ({
      subSectionId,
      text,
      embedding: embeddings[i],
    }));

    await LectureChunk.insertMany(docs);

    console.log("✅ Chunks stored");

    return true;
  } catch (err) {
    console.error("Chunk error:", err.message);
    return false;
  }
}

module.exports = processAndStoreChunks;