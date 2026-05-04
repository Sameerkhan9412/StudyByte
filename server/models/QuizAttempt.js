// models/QuizAttempt.js

const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subSectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
      required: true,
    },

    answers: [
      {
        type: String,
      },
    ],

    score: {
      type: Number,
      required: true,
    },

    passed: {
      type: Boolean,
      default: false,
    },

    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// One user can attempt same quiz many times
quizAttemptSchema.index({
  userId: 1,
  subSectionId: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema
);