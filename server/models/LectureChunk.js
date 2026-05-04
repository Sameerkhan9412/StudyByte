// models/LectureChunk.js

const mongoose = require("mongoose");

const lectureChunkSchema = new mongoose.Schema(
  {
    subSectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LectureChunk", lectureChunkSchema);