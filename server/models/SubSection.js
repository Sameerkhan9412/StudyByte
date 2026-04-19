const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema(
{
  title: String,
  timeDuration: String,
  description: String,
  videoUrl: String,

  transcript: { type: String, default: "" },

  transcriptStatus: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },

  transcriptError: { type: String, default: "" },
},
{ timestamps: true }
);

module.exports = mongoose.model("SubSection", SubSectionSchema);