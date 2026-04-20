import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { generateQuiz } from "../../../../../services/operations/courseDetailsAPI";

export default function QuizReviewModal({
  subSectionId,
  setShowQuizModal,
}) {
  const { token } = useSelector((state) => state.auth);

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuiz = async () => {
    try {
      setLoading(true);

      const result = await generateQuiz(
        { subSectionId },
        token
      );

      setQuiz(result);
    } catch (error) {
      toast.error("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-5xl rounded-2xl border border-richblack-700 bg-richblack-800 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-richblack-700 px-6 py-5">
          <div>
            <h2 className="text-3xl font-bold text-richblack-5">
              Quiz Review
            </h2>
            <p className="mt-1 text-sm text-richblack-300">
              Review generated questions before publishing
            </p>
          </div>

          <button
            onClick={() => setShowQuizModal(false)}
            className="rounded-full p-2 text-richblack-200 transition-all hover:bg-richblack-700 hover:text-white"
          >
            <RxCross2 className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[72vh] overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-50 border-t-transparent"></div>
              <p className="mt-4 text-richblack-200">
                Generating beautiful quiz...
              </p>
            </div>
          ) : quiz?.questions?.length > 0 ? (
            <div className="space-y-6">
              {quiz.questions.map((q, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-richblack-700 bg-richblack-700/60 p-5"
                >
                  {/* Question */}
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-50 font-bold text-richblack-900">
                      {index + 1}
                    </div>

                    <h3 className="pt-1 text-lg font-semibold text-richblack-5 leading-7">
                      {q.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="grid gap-3 md:grid-cols-2">
                    {q.options.map((opt, i) => {
                      const isCorrect =
                        opt === q.correctAnswer;

                      return (
                        <div
                          key={i}
                          className={`rounded-xl border px-4 py-3 text-sm transition-all ${
                            isCorrect
                              ? "border-green-500 bg-green-500/10 text-green-300"
                              : "border-richblack-600 bg-richblack-800 text-richblack-100"
                          }`}
                        >
                          <span className="mr-2 font-semibold">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-richblack-50">
                      <span className="font-semibold text-yellow-50">
                        Explanation:
                      </span>{" "}
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-richblack-100">
                No quiz found
              </p>
              <p className="mt-2 text-sm text-richblack-400">
                Generate a quiz to review questions here.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-richblack-700 px-6 py-4">
          <button
            onClick={() => setShowQuizModal(false)}
            className="rounded-lg bg-richblack-700 px-5 py-2 font-medium text-richblack-50 transition hover:bg-richblack-600"
          >
            Close
          </button>

          <button
            className="rounded-lg bg-yellow-50 px-5 py-2 font-semibold text-richblack-900 transition hover:scale-[1.02]"
          >
            Publish Quiz
          </button>
        </div>
      </div>
    </div>
  );
}