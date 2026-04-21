// src/components/core/ViewCourse/Quiz.jsx
import React, { useState } from "react"

const Quiz = ({ questions, onPass, onFail }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const PASSING_PERCENTAGE = 70

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }))
  }

  const handleSubmitQuiz = () => {
    let correctAnswers = 0

    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswerIndex) {
        correctAnswers++
      }
    })

    const percentage = (correctAnswers / questions.length) * 100
    setScore(percentage)
    setQuizSubmitted(true)

    if (percentage >= PASSING_PERCENTAGE) {
      onPass()
    } else {
      onFail()
    }
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setQuizSubmitted(false)
    setScore(0)
  }

  const allQuestionsAnswered =
    Object.keys(selectedAnswers).length === questions.length

  // ─── Quiz Result Screen ───────────────────────────────────────────
  if (quizSubmitted) {
    const passed = score >= PASSING_PERCENTAGE

    return (
      <div className="flex flex-col items-center gap-6 rounded-xl bg-richblack-800 p-8 text-white">
        {/* Result Header */}
        <div
          className={`flex h-24 w-24 items-center justify-center rounded-full text-4xl
            ${passed ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
        >
          {passed ? "✓" : "✗"}
        </div>

        <h2 className="text-2xl font-bold">
          {passed ? "Quiz Passed! 🎉" : "Quiz Failed"}
        </h2>

        {/* Score Display */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-richblack-200">Your Score</p>
          <p
            className={`text-5xl font-bold
              ${passed ? "text-green-500" : "text-red-500"}`}
          >
            {Math.round(score)}%
          </p>
          <p className="text-richblack-300 text-sm">
            Passing score: {PASSING_PERCENTAGE}%
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="w-full rounded-lg bg-richblack-700 p-4">
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-richblack-300">Progress</span>
            <span className="text-richblack-100">
              {Math.round((score / 100) * questions.length)}/{questions.length}{" "}
              Correct
            </span>
          </div>
          {/* Progress Bar */}
          <div className="h-3 w-full overflow-hidden rounded-full bg-richblack-600">
            <div
              className={`h-full rounded-full transition-all duration-700
                ${passed ? "bg-green-500" : "bg-red-500"}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Answer Review */}
        <div className="w-full space-y-4">
          <h3 className="font-semibold text-richblack-100">Answer Review</h3>
          {questions.map((question, qIndex) => {
            const isCorrect =
              selectedAnswers[qIndex] === question.correctAnswerIndex
            return (
              <div
                key={qIndex}
                className={`rounded-lg border p-4
                  ${
                    isCorrect
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-red-500/30 bg-red-500/10"
                  }`}
              >
                <p className="mb-2 text-sm font-medium">
                  {qIndex + 1}. {question.question}
                </p>
                <p className="text-xs text-richblack-300">
                  Your answer:{" "}
                  <span
                    className={isCorrect ? "text-green-400" : "text-red-400"}
                  >
                    {question.options[selectedAnswers[qIndex]]}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="text-xs text-richblack-300">
                    Correct answer:{" "}
                    <span className="text-green-400">
                      {question.options[question.correctAnswerIndex]}
                    </span>
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!passed && (
            <button
              onClick={handleRetakeQuiz}
              className="rounded-lg bg-yellow-50 px-6 py-2 font-semibold
                text-richblack-900 transition-all hover:scale-95"
            >
              Retake Quiz
            </button>
          )}
        </div>
      </div>
    )
  }

  // ─── Quiz Question Screen ─────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-6 text-white">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-yellow-50">
          📝 Lecture Quiz
        </h2>
        <span className="text-sm text-richblack-300">
          {Object.keys(selectedAnswers).length}/{questions.length} Answered
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-richblack-600">
        <div
          className="h-full rounded-full bg-yellow-50 transition-all duration-300"
          style={{
            width: `${
              (Object.keys(selectedAnswers).length / questions.length) * 100
            }%`,
          }}
        />
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="rounded-lg bg-richblack-700 p-5 transition-all"
          >
            {/* Question */}
            <p className="mb-4 font-medium">
              <span className="mr-2 text-yellow-50">{qIndex + 1}.</span>
              {question.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <label
                  key={oIndex}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg
                    border p-3 transition-all
                    ${
                      selectedAnswers[qIndex] === oIndex
                        ? "border-yellow-50 bg-yellow-50/10 text-yellow-50"
                        : "border-richblack-600 text-richblack-200 hover:border-richblack-400"
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={oIndex}
                    checked={selectedAnswers[qIndex] === oIndex}
                    onChange={() => handleAnswerSelect(qIndex, oIndex)}
                    className="hidden"
                  />
                  {/* Custom Radio */}
                  <div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center
                      rounded-full border-2 transition-all
                      ${
                        selectedAnswers[qIndex] === oIndex
                          ? "border-yellow-50 bg-yellow-50"
                          : "border-richblack-400"
                      }`}
                  >
                    {selectedAnswers[qIndex] === oIndex && (
                      <div className="h-2 w-2 rounded-full bg-richblack-900" />
                    )}
                  </div>
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitQuiz}
        disabled={!allQuestionsAnswered}
        className={`rounded-lg py-3 font-semibold transition-all
          ${
            allQuestionsAnswered
              ? "bg-yellow-50 text-richblack-900 hover:scale-95"
              : "cursor-not-allowed bg-richblack-600 text-richblack-400"
          }`}
      >
        {allQuestionsAnswered
          ? "Submit Quiz"
          : `Answer All Questions (${questions.length - Object.keys(selectedAnswers).length} remaining)`}
      </button>
    </div>
  )
}

export default Quiz