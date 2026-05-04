const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    timeDuration: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    transcript: {
      type: String,
      default: "",
    },

    transcriptStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    transcriptError: {
      type: String,
      default: "",
    },

    // 🔥 NEW (VERY IMPORTANT)
    ragStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    language: {
      type: String,
      default: "english",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubSection", SubSectionSchema);