// ======================================================
// 1. Get Quiz for Student

const CourseProgress = require("../models/CourseProgress");
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");

// ======================================================
exports.getStudentQuiz = async (req, res) => {
  try {
    const { subSectionId } = req.body;

    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId is required",
      });
    }

    const quiz = await Quiz.findOne({
      subSectionId,
      published: true,
    }).select("questions");

    // If no quiz found
    if (!quiz) {
      return res.status(200).json({
        success: true,
        data: {
          hasQuiz: false,
          subSectionId,
          questions: [],
        },
        message: "No quiz available",
      });
    }

    const questions = quiz.questions.map((q) => ({
      question: q.question,
      options: q.options,
    }));

    return res.status(200).json({
      success: true,
      data: {
        hasQuiz: true,
        subSectionId,
        questions,
      },
      message: "Quiz fetched successfully",
    });

  } catch (error) {
    console.error("Get Student Quiz Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get quiz",
      error: error.message,
    });
  }
};

// ======================================================
// 2. Submit Quiz Answers + Check Result
// ======================================================
exports.submitQuizAnswers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, subSectionId, answers } = req.body;

    if (!courseId || !subSectionId || !answers) {
      return res.status(400).json({
        success: false,
        message:
          "courseId, subSectionId and answers are required",
      });
    }

    const quiz = await Quiz.findOne({
      subSectionId,
      published: true,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    let correctCount = 0;

    const resultQuestions = quiz.questions.map(
      (q, index) => {
        const selectedAnswer = answers[index];

        const isCorrect =
          selectedAnswer === q.correctAnswer;

        if (isCorrect) correctCount++;

        return {
          question: q.question,
          selectedAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation,
        };
      }
    );

    const total = quiz.questions.length;
    const percentage = Math.round(
      (correctCount / total) * 100
    );

    const passed = percentage >= 60;

    // Save Attempt
    await QuizAttempt.create({
      userId,
      subSectionId,
      score: percentage,
      passed,
      answers,
    });

    // If Passed → Mark Lecture Completed
    if (passed) {
      const progress =
        await CourseProgress.findOne({
          courseID: courseId,
          userId,
        });

      if (
        progress &&
        !progress.completedVideos.includes(
          subSectionId
        )
      ) {
        progress.completedVideos.push(subSectionId);
        await progress.save();
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        score: percentage,
        passed,
        correctCount,
        total,
        results: resultQuestions,
      },
      message: passed
        ? "Quiz passed successfully"
        : "Quiz failed. Try again.",
    });

  } catch (error) {
    console.error("Submit Quiz Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
      error: error.message,
    });
  }
};