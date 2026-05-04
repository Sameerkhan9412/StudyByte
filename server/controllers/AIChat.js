// controllers/AIChat.js

const Groq = require("groq-sdk");
const SubSection = require("../models/SubSection");
const { getEmbedding } = require("../utils/embedding");
const LectureChunk = require("../models/LectureChunk");
const { default: mongoose } = require("mongoose");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// chunking
const createChunks = (text, size = 500) => {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks = [];

  for (let i = 0; i < clean.length; i += size) {
    chunks.push({
      text: clean.slice(i, i + size),
      startTime: null,
      endTime: null,
    });
  }

  return chunks;
};

// retreival
const getRelevantChunks = (chunks, query) => {
  const words = query
    .toLowerCase()
    .split(" ")
    .filter(Boolean);

  const scored = chunks.map((chunk) => {
    let score = 0;
    const text = chunk.text.toLowerCase();

    words.forEach((word) => {
      if (text.includes(word)) score++;
    });

    return {
      ...chunk,
      score,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

// Ask ai chat

exports.askLectureAI = async (req, res) => {
  try {
    const { subSectionId, question } = req.body;

    const queryEmbedding = await getEmbedding(question);

    const results = await LectureChunk.aggregate([
      {
        $vectorSearch: {
          index: "lecture_embedding_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 20,
          limit: 5,
          filter: {
            subSectionId: new mongoose.Types.ObjectId(subSectionId),
          },
        },
      },
      {
        $project: {
          text: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    const context = results.map((r) => r.text).join("\n\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Answer only from given context.",
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
    });

    return res.json({
      success: true,
      answer: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//get lecture summary
exports.getLectureSummary = async (req, res) => {
  try {
    const { subSectionId } = req.body;

    const lecture = await SubSection.findById(
      subSectionId
    );

    if (!lecture || !lecture.transcript) {
      return res.status(404).json({
        success: false,
        message: "Transcript not found",
      });
    }

    const prompt = `
Summarize this lecture in 5 bullet points.

Lecture:
${lecture.transcript}
`;

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const summary =
      completion.choices[0]?.message?.content || "";

    return res.status(200).json({
      success: true,
      data: { summary },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// generate notes
exports.generateLectureNotes = async (
  req,
  res
) => {
  try {
    const { subSectionId } = req.body;

    const lecture = await SubSection.findById(
      subSectionId
    );

    if (!lecture || !lecture.transcript) {
      return res.status(404).json({
        success: false,
        message: "Transcript not found",
      });
    }

    const prompt = `
Create clean revision notes from this lecture.

Use headings, bullets, and key points.

Lecture:
${lecture.transcript}
`;

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const notes =
      completion.choices[0]?.message?.content || "";

    return res.status(200).json({
      success: true,
      data: { notes },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};