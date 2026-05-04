import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { submitQuizAnswers } from "../../../services/operations/courseDetailsAPI";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineRefresh,
  HiOutlineLightBulb,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
} from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";
import {
  FiAward,
  FiTarget,
  FiAlertTriangle,
  FiCheck,
  FiX,
} from "react-icons/fi";

// ─── Animated Progress Ring ─────────────────────────────────────
const ProgressRing = ({ score, passed, size = 120 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="5"
          fill="none"
          className="stroke-richblack-700"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="5"
          fill="none"
          strokeDasharray={`${(animatedScore / 100) * circumference} ${circumference}`}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${
            passed ? "stroke-caribbeangreen-200" : "stroke-[#EF4444]"
          }`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-2xl sm:text-3xl font-black tracking-tight ${
            passed ? "text-caribbeangreen-200" : "text-[#EF4444]"
          }`}
        >
          {animatedScore}%
        </span>
        <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-richblack-400 font-semibold mt-0.5">
          Score
        </span>
      </div>
    </div>
  );
};

// ─── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-richblack-700/40 border border-richblack-600/30">
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}
    >
      <Icon className="text-sm" />
    </div>
    <div>
      <p className="text-lg font-bold text-richblack-25 leading-none">
        {value}
      </p>
      <p className="text-[10px] text-richblack-400 uppercase tracking-wider font-medium mt-0.5">
        {label}
      </p>
    </div>
  </div>
);

const Quiz = ({ questions, courseId, subSectionId, token, onPass, onFail }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [animateIn, setAnimateIn] = useState(true);
  const resultRef = useRef(null);
  const [viewMode, setViewMode] = useState("all");

  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? "stepper" : "all");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAnswerSelect = (qIndex, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
    if (viewMode === "stepper" && currentStep < questions.length - 1) {
      setTimeout(() => goToStep(currentStep + 1), 400);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setLoading(true);
      const answers = questions.map((_, index) => selectedAnswers[index]);
      const res = await submitQuizAnswers(
        { courseId, subSectionId, answers },
        token,
      );
      setResult(res);
      setQuizSubmitted(true);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);

      if (res.passed) onPass();
      else onFail();
    } catch (error) {
      toast.error("Failed to submit quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setResult(null);
    setCurrentStep(0);
  };

  const goToStep = (step) => {
    setAnimateIn(false);
    setTimeout(() => {
      setCurrentStep(step);
      setAnimateIn(true);
    }, 150);
  };

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  // ─── Result View ──────────────────────────────────────────────
  if (quizSubmitted && result) {
    const passed = result.passed;

    return (
      <div
        ref={resultRef}
        className="rounded-2xl sm:rounded-3xl bg-gradient-to-b from-richblack-800 to-richblack-900
          border border-richblack-700 overflow-hidden shadow-2xl shadow-black/20"
      >
        {/* Result Header */}
        <div className="relative px-4 sm:px-8 py-8 sm:py-12 text-center overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px]"
            style={{
              backgroundColor: passed ? "#047857" : "#EF4444",
              opacity: 0.07,
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[100px]"
            style={{
              backgroundColor: passed ? "#FFD60A" : "#F97316",
              opacity: 0.05,
            }}
          />

          <div className="relative z-[1]">
            {/* Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5
                ${
                  passed
                    ? "bg-caribbeangreen-400/15 text-caribbeangreen-200 ring-1 ring-caribbeangreen-200/20"
                    : "bg-[#EF4444]/15 text-[#EF4444] ring-1 ring-[#EF4444]/20"
                }`}
            >
              {passed ? (
                <>
                  <FiCheck className="text-xs" /> Passed
                </>
              ) : (
                <>
                  <FiX className="text-xs" /> Not Passed
                </>
              )}
            </div>

            {/* Icon */}
            <div
              className={`mx-auto mb-4 sm:mb-5 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[20px]
                flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500
                ${
                  passed
                    ? "bg-caribbeangreen-400/15 ring-1 ring-caribbeangreen-200/20"
                    : "bg-[#EF4444]/15 ring-1 ring-[#EF4444]/20"
                }`}
            >
              {passed ? (
                <FiAward className="text-3xl sm:text-4xl text-yellow-200" />
              ) : (
                <FiAlertTriangle className="text-3xl sm:text-4xl text-[#EF4444]" />
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-richblack-5 mb-1.5 sm:mb-2 tracking-tight">
              {passed ? "Excellent Work! 🎉" : "Keep Practicing!"}
            </h2>
            <p className="text-xs sm:text-sm text-richblack-300 max-w-md mx-auto leading-relaxed">
              {passed
                ? "You've demonstrated a strong understanding of this material."
                : "Review the content and try again. You're almost there!"}
            </p>

            {/* Score & Stats */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <ProgressRing score={result.score} passed={passed} />

              <div className="flex flex-row sm:flex-col gap-3 sm:gap-2.5">
                <StatCard
                  icon={FiCheck}
                  label="Correct"
                  value={result.correctCount}
                  colorClass="bg-caribbeangreen-400/15 text-caribbeangreen-200"
                />
                <StatCard
                  icon={FiX}
                  label="Wrong"
                  value={result.total - result.correctCount}
                  colorClass="bg-[#EF4444]/15 text-[#EF4444]"
                />
                <StatCard
                  icon={FiTarget}
                  label="Total"
                  value={result.total}
                  colorClass="bg-blue-500/15 text-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 sm:mx-8 h-px bg-gradient-to-r from-transparent via-richblack-600 to-transparent" />

        {/* Answer Review */}
        <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-richblack-100 mb-4 sm:mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-yellow-200/10 flex items-center justify-center">
              <HiOutlineLightBulb className="text-yellow-200 text-sm" />
            </div>
            Answer Review
          </h3>

          {result.results.map((item, i) => {
            const isCorrect = item.isCorrect;
            return (
              <div
                key={i}
                className={`group rounded-xl sm:rounded-2xl border p-4 sm:p-5
                  transition-all duration-300 hover:shadow-lg
                  ${
                    isCorrect
                      ? "border-caribbeangreen-200/15 bg-caribbeangreen-400/[0.03] hover:border-caribbeangreen-200/25"
                      : "border-[#EF4444]/15 bg-[#EF4444]/[0.03] hover:border-[#EF4444]/25"
                  }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Status icon */}
                  <div
                    className={`mt-0.5 flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl
                      flex items-center justify-center transition-transform duration-300
                      group-hover:scale-110
                      ${
                        isCorrect
                          ? "bg-caribbeangreen-400/15 text-caribbeangreen-200"
                          : "bg-[#EF4444]/15 text-[#EF4444]"
                      }`}
                  >
                    {isCorrect ? (
                      <FiCheck className="text-sm" />
                    ) : (
                      <FiX className="text-sm" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-[15px] font-semibold text-richblack-25 mb-3 leading-relaxed">
                      <span className="text-richblack-400 font-medium">
                        Q{i + 1}.
                      </span>{" "}
                      {item.question}
                    </p>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                          isCorrect
                            ? "bg-caribbeangreen-400/10"
                            : "bg-[#EF4444]/10"
                        }`}
                      >
                        <span className="text-richblack-400 text-[11px] uppercase tracking-wider font-medium">
                          Your answer
                        </span>
                        <span
                          className={`font-semibold ${
                            isCorrect
                              ? "text-caribbeangreen-200"
                              : "text-[#EF4444]"
                          }`}
                        >
                          {item.selectedAnswer}
                        </span>
                      </div>

                      {!isCorrect && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-caribbeangreen-400/10 ml-2">
                          <span className="text-richblack-400 text-[11px] uppercase tracking-wider font-medium">
                            Correct
                          </span>
                          <span className="font-semibold text-caribbeangreen-200">
                            {item.correctAnswer}
                          </span>
                        </div>
                      )}

                      {item.explanation && (
                        <div className="mt-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-richblack-700/60 to-richblack-700/30 border border-richblack-600/30">
                          <div className="flex items-start gap-2">
                            <span className="text-base mt-0.5 flex-shrink-0">
                              💡
                            </span>
                            <p className="text-richblack-300 text-[11px] sm:text-xs leading-relaxed">
                              {item.explanation}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Retake Button */}
        {!passed && (
          <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
            <button
              onClick={handleRetakeQuiz}
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5
                rounded-xl sm:rounded-2xl
                bg-yellow-200 hover:bg-yellow-100
                px-8 sm:px-10 py-3.5 sm:py-4
                font-bold text-sm sm:text-base text-richblack-900
                transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                shadow-lg shadow-yellow-200/10 hover:shadow-xl hover:shadow-yellow-200/20"
            >
              <HiOutlineRefresh className="text-lg transition-transform duration-500 group-hover:rotate-180" />
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── Questions View ───────────────────────────────────────────
  return (
    <div
      className="rounded-2xl sm:rounded-3xl bg-gradient-to-b from-richblack-800 to-richblack-900
      border border-richblack-700 overflow-hidden shadow-2xl shadow-black/20"
    >
      {/* Quiz Header */}
      <div
        className="relative px-4 sm:px-6 md:px-8 py-5 sm:py-6
        bg-gradient-to-r from-richblack-700/80 via-richblack-700/50 to-richblack-700/80
        border-b border-richblack-700"
      >
        {/* Subtle top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-3xl"
          style={{ backgroundColor: "#FFD60A", opacity: 0.04 }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl
              bg-yellow-200/10 flex items-center justify-center ring-1 ring-yellow-200/10"
            >
              <FiTarget className="text-yellow-200 text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Lecture Quiz
              </h2>
              <p className="text-[10px] sm:text-xs text-richblack-400 mt-0.5">
                Answer all {questions.length} questions to proceed
              </p>
            </div>
          </div>

          {/* Progress Pills */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-1 sm:gap-1.5">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => viewMode === "stepper" && goToStep(idx)}
                  className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl
                    text-[10px] sm:text-xs font-bold
                    transition-all duration-300 flex items-center justify-center
                    ${
                      selectedAnswers[idx] !== undefined
                        ? "bg-yellow-200 text-richblack-900 shadow-md shadow-yellow-200/20 scale-105"
                        : currentStep === idx && viewMode === "stepper"
                          ? "bg-richblack-600 text-white ring-2 ring-yellow-200/40 scale-105"
                          : "bg-richblack-600/60 text-richblack-400 hover:bg-richblack-600 hover:text-richblack-300"
                    }`}
                >
                  {selectedAnswers[idx] !== undefined ? (
                    <FiCheck className="text-[10px] sm:text-xs" />
                  ) : (
                    idx + 1
                  )}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 ml-1 px-2.5 py-1 rounded-lg bg-richblack-700/50">
              <span className="text-xs font-bold text-yellow-200">
                {answeredCount}
              </span>
              <span className="text-xs text-richblack-500">/</span>
              <span className="text-xs text-richblack-400">
                {questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 sm:mt-5 h-1 sm:h-1.5 w-full rounded-full bg-richblack-600/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-yellow-200 transition-all duration-700 ease-out relative"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* Questions Body */}
      <div className="p-4 sm:p-6 md:p-8">
        {viewMode === "stepper" ? (
          <div
            className={`transition-all duration-200 ${
              animateIn
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
          >
            <QuestionCard
              question={questions[currentStep]}
              qIndex={currentStep}
              selectedAnswer={selectedAnswers[currentStep]}
              onSelect={handleAnswerSelect}
              total={questions.length}
            />

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between mt-5 sm:mt-6">
              <button
                disabled={currentStep === 0}
                onClick={() => goToStep(currentStep - 1)}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-richblack-300
                  hover:text-white disabled:opacity-20 disabled:cursor-not-allowed
                  transition-all duration-200 px-3 py-2.5 rounded-xl hover:bg-richblack-700/60
                  active:scale-95"
              >
                <HiOutlineChevronLeft className="text-sm" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? "w-6 bg-yellow-200"
                        : "w-1.5 bg-richblack-600"
                    }`}
                  />
                ))}
              </div>

              {currentStep < questions.length - 1 ? (
                <button
                  onClick={() => goToStep(currentStep + 1)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-yellow-200
                    hover:text-yellow-100 transition-all duration-200
                    px-3 py-2.5 rounded-xl hover:bg-richblack-700/60 active:scale-95"
                >
                  Next
                  <HiOutlineChevronRight className="text-sm" />
                </button>
              ) : (
                <div className="w-16" />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {questions.map((q, qIndex) => (
              <QuestionCard
                key={qIndex}
                question={q}
                qIndex={qIndex}
                selectedAnswer={selectedAnswers[qIndex]}
                onSelect={handleAnswerSelect}
                total={questions.length}
              />
            ))}
          </div>
        )}

        {/* Submit Section */}
        <div
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center
          justify-between gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-richblack-700"
        >
          <div className="text-center sm:text-left">
            {allAnswered ? (
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                bg-caribbeangreen-400/10 border border-caribbeangreen-200/15"
              >
                <HiOutlineCheckCircle className="text-caribbeangreen-200 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-caribbeangreen-200">
                  All questions answered — ready to submit!
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-richblack-700/40">
                <span className="text-xs sm:text-sm text-richblack-400">
                  <span className="font-bold text-richblack-300">
                    {questions.length - answeredCount}
                  </span>{" "}
                  question{questions.length - answeredCount > 1 ? "s" : ""}{" "}
                  remaining
                </span>
              </div>
            )}
          </div>

          <button
            disabled={!allAnswered || loading}
            onClick={handleSubmitQuiz}
            className={`group flex items-center justify-center gap-2.5
              rounded-xl sm:rounded-2xl px-8 sm:px-10 py-3.5 sm:py-4
              text-sm sm:text-base font-bold
              transition-all duration-300 active:scale-[0.97]
              ${
                allAnswered && !loading
                  ? "bg-yellow-200 text-richblack-900 hover:bg-yellow-100 hover:shadow-xl hover:shadow-yellow-200/20 hover:scale-[1.02]"
                  : "bg-richblack-700/50 text-richblack-500 cursor-not-allowed border border-richblack-600/30"
              }`}
          >
            {loading ? (
              <>
                <BiLoaderAlt className="text-lg animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Quiz
                <HiOutlineChevronRight className="text-lg transition-transform duration-300 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Question Card Component ──────────────────────────────────────
const QuestionCard = ({
  question,
  qIndex,
  selectedAnswer,
  onSelect,
  total,
}) => {
  return (
    <div
      className="group rounded-xl sm:rounded-2xl
      bg-gradient-to-br from-richblack-700/40 to-richblack-800/40
      border border-richblack-700
      p-4 sm:p-5 md:p-6
      transition-all duration-300
      hover:border-richblack-600 hover:shadow-lg hover:shadow-black/10"
    >
      {/* Question Header */}
      <div className="flex items-start gap-3 mb-4 sm:mb-5">
        <div
          className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl
          bg-yellow-200/10 ring-1 ring-yellow-200/10
          flex items-center justify-center
          text-[11px] sm:text-xs font-black text-yellow-200
          transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
        >
          {qIndex + 1}
        </div>
        <div className="flex-1">
          <p className="text-sm sm:text-[15px] font-semibold text-richblack-25 leading-relaxed">
            {question.question}
          </p>
          <p className="text-[10px] text-richblack-500 mt-1 font-medium">
            Question {qIndex + 1} of {total}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2 sm:space-y-2.5 ml-0 sm:ml-12">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === option;
          const optionLetter = String.fromCharCode(65 + i);

          return (
            <label
              key={i}
              className={`group/option flex items-center gap-3 sm:gap-3.5 cursor-pointer
                rounded-xl border p-3 sm:p-3.5
                transition-all duration-200 active:scale-[0.99]
                ${
                  isSelected
                    ? "border-yellow-200/40 bg-yellow-200/10 shadow-lg shadow-yellow-200/5 ring-1 ring-yellow-200/10"
                    : "border-richblack-600/40 bg-richblack-800/30 hover:border-richblack-500/60 hover:bg-richblack-700/40"
                }`}
            >
              <input
                type="radio"
                className="hidden"
                name={`q-${qIndex}`}
                checked={isSelected}
                onChange={() => onSelect(qIndex, option)}
              />

              {/* Option Letter Badge */}
              <div
                className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl
                flex items-center justify-center
                text-[10px] sm:text-xs font-bold
                transition-all duration-300
                ${
                  isSelected
                    ? "bg-yellow-200 text-richblack-900 shadow-md shadow-yellow-200/20 scale-105"
                    : "bg-richblack-600/50 text-richblack-400 group-hover/option:bg-richblack-600 group-hover/option:text-richblack-300"
                }`}
              >
                {isSelected ? <FiCheck className="text-xs" /> : optionLetter}
              </div>

              <span
                className={`text-xs sm:text-sm leading-relaxed transition-colors duration-200 flex-1
                ${
                  isSelected
                    ? "text-yellow-200 font-medium"
                    : "text-richblack-200 group-hover/option:text-richblack-100"
                }`}
              >
                {option}
              </span>

              {/* Selected indicator */}
              {isSelected && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-200 animate-pulse" />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;
