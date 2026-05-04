import React, { useState, useRef, useEffect } from "react";
import {
  askLectureAI,
  getLectureSummary,
  generateLectureNotes,
} from "../../../services/operations/courseDetailsAPI";
import {
  HiOutlineLightningBolt,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlinePaperAirplane,
  HiOutlineRefresh,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineX,
  HiOutlineClipboard,
  HiOutlineCheck,
} from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";
import { FiCpu, FiMessageSquare, FiFileText, FiBook } from "react-icons/fi";
import toast from "react-hot-toast";

// ─── Tab Config ────────────────────────────────────────────────────
const TABS = [
  {
    id: "ask",
    label: "Ask AI",
    shortLabel: "Ask",
    icon: FiMessageSquare,
    description: "Ask anything about this lecture",
  },
  // {
  //   id: "summary",
  //   label: "Summary",
  //   shortLabel: "Summary",
  //   icon: FiFileText,
  //   description: "Get a quick summary of this lecture",
  // },
  // {
  //   id: "notes",
  //   label: "Notes",
  //   shortLabel: "Notes",
  //   icon: FiBook,
  //   description: "Generate structured study notes",
  // },
];

// ─── Copy Button ────────────────────────────────────────────────────
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-[10px] sm:text-xs
        text-richblack-400 hover:text-richblack-200
        bg-richblack-700 hover:bg-richblack-600
        border border-richblack-600 hover:border-richblack-500
        rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5
        transition-all duration-200"
    >
      {copied ? (
        <>
          <HiOutlineCheck className="text-emerald-400 text-xs sm:text-sm" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <HiOutlineClipboard className="text-xs sm:text-sm" />
          Copy
        </>
      )}
    </button>
  );
};

// ─── Formatted AI Response ──────────────────────────────────────────
const FormattedResponse = ({ text }) => {
  if (!text) return null;

  // Parse markdown-like formatting
  const lines = text.split("\n");

  return (
    <div className="space-y-2 text-xs sm:text-sm text-richblack-100 leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        // Heading: ## Title
        if (line.startsWith("## ")) {
          return (
            <h3
              key={i}
              className="text-sm sm:text-base font-bold text-white mt-3 mb-1
                border-b border-richblack-600 pb-1"
            >
              {line.replace("## ", "")}
            </h3>
          );
        }

        // Sub-heading: ### Title
        if (line.startsWith("### ")) {
          return (
            <h4
              key={i}
              className="text-xs sm:text-sm font-semibold text-yellow-50 mt-2"
            >
              {line.replace("### ", "")}
            </h4>
          );
        }

        // Bullet point: - item or * item
        if (line.match(/^[-*]\s/)) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-yellow-50 mt-1 flex-shrink-0 text-xs">•</span>
              <span className="text-richblack-200">
                {line.replace(/^[-*]\s/, "")}
              </span>
            </div>
          );
        }

        // Numbered list: 1. item
        if (line.match(/^\d+\.\s/)) {
          const num = line.match(/^(\d+)\./)[1];
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-yellow-50 font-bold flex-shrink-0 text-xs
                w-4 text-right mt-0.5">
                {num}.
              </span>
              <span className="text-richblack-200">
                {line.replace(/^\d+\.\s/, "")}
              </span>
            </div>
          );
        }

        // Bold: **text**
        if (line.includes("**")) {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className="text-richblack-200">
              {parts.map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="text-white font-semibold">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          );
        }

        // Regular paragraph
        return (
          <p key={i} className="text-richblack-200">
            {line}
          </p>
        );
      })}
    </div>
  );
};

// ─── Chat Message Bubble ────────────────────────────────────────────
const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-2 sm:gap-3 animate-fadeInUp
        ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full
          flex items-center justify-center text-xs font-bold
          ${isUser
            ? "bg-yellow-50 text-richblack-900"
            : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
          }`}
      >
        {isUser ? "You" : <FiCpu className="text-sm" />}
      </div>

      {/* Bubble */}
      <div
        className={`flex flex-col gap-1.5 max-w-[85%]
          ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3
            ${isUser
              ? "bg-yellow-50 text-richblack-900 rounded-tr-sm"
              : "bg-richblack-700 border border-richblack-600 rounded-tl-sm"
            }`}
        >
          {isUser ? (
            <p className="text-xs sm:text-sm font-medium">{message.content}</p>
          ) : (
            <FormattedResponse text={message.content} />
          )}
        </div>

        {/* Copy button for AI responses */}
        {!isUser && message.content && (
          <CopyButton text={message.content} />
        )}
      </div>
    </div>
  );
};

// ─── Main AI Panel Component ────────────────────────────────────────
const LectureAIPanel = ({ subSectionId, courseId, token, videoData }) => {
  const [activeTab, setActiveTab] = useState("ask");
  const [isExpanded, setIsExpanded] = useState(true);

  // Ask AI states
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [askingAI, setAskingAI] = useState(false);

  // Summary states
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryFetched, setSummaryFetched] = useState(false);

  // Notes states
  const [notes, setNotes] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notesFetched, setNotesFetched] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Reset on lecture change
  useEffect(() => {
    setChatHistory([]);
    setSummary("");
    setNotes("");
    setSummaryFetched(false);
    setNotesFetched(false);
    setQuestion("");
    setActiveTab("ask");
  }, [subSectionId]);

  // ── Ask AI ────────────────────────────────────────────────────────
  const handleAskAI = async (e) => {
    e?.preventDefault();
    if (!question.trim() || askingAI) return;

    const userMessage = question.trim();
    setQuestion("");

    // Add user message immediately
    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: userMessage, id: Date.now() },
    ]);

    setAskingAI(true);

    try {
      const res = await askLectureAI(
        {
          subSectionId,
          courseId,
          question: userMessage,
        },
        token
      );
      console.log("ai response",res);

      const aiAnswer = res?.answer || res?.response || res || "No response received.";

      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          content: typeof aiAnswer === "string" ? aiAnswer : JSON.stringify(aiAnswer),
          id: Date.now() + 1,
        },
      ]);
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Failed to get AI response";
      toast.error(errMsg);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I couldn't process your question. Please try again.",
          id: Date.now() + 1,
          isError: true,
        },
      ]);
    } finally {
      setAskingAI(false);
      inputRef.current?.focus();
    }
  };

  // ── Get Summary ───────────────────────────────────────────────────
  const handleGetSummary = async () => {
    if (loadingSummary || summaryFetched) return;
    setLoadingSummary(true);

    try {
      const res = await getLectureSummary(
        { subSectionId, courseId },
        token
      );

      const summaryText = res?.summary || res?.content || res || "No summary available.";
      setSummary(typeof summaryText === "string" ? summaryText : JSON.stringify(summaryText));
      setSummaryFetched(true);
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Failed to generate summary";
      toast.error(errMsg);
      setSummary("Failed to load summary. Please try again.");
    } finally {
      setLoadingSummary(false);
    }
  };

  // ── Generate Notes ─────────────────────────────────────────────────
  const handleGenerateNotes = async () => {
    if (loadingNotes || notesFetched) return;
    setLoadingNotes(true);

    try {
      const res = await generateLectureNotes(
        { subSectionId, courseId },
        token
      );

      const notesText = res?.notes || res?.content || res || "No notes available.";
      setNotes(typeof notesText === "string" ? notesText : JSON.stringify(notesText));
      setNotesFetched(true);
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Failed to generate notes";
      toast.error(errMsg);
      setNotes("Failed to generate notes. Please try again.");
    } finally {
      setLoadingNotes(false);
    }
  };

  // Auto-fetch when tab switches
  useEffect(() => {
    if (activeTab === "summary" && !summaryFetched && !loadingSummary) {
      handleGetSummary();
    }
    if (activeTab === "notes" && !notesFetched && !loadingNotes) {
      handleGenerateNotes();
    }
  }, [activeTab]);

  // ── Suggested Questions ───────────────────────────────────────────
  const suggestedQuestions = [
    "Summarize the key points",
    "What are the main concepts?",
    "Give me an example",
    "What should I remember?",
  ];

  return (
    <div className="rounded-xl sm:rounded-2xl bg-richblack-800
      border border-richblack-700 overflow-hidden mt-6 sm:mt-8
      shadow-lg shadow-richblack-900/30">

      {/* ── Panel Header ───────────────────────────────────────────── */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between
          px-4 sm:px-6 py-3 sm:py-4
          bg-gradient-to-r from-richblack-700/80 to-richblack-700/40
          border-b border-richblack-700 hover:bg-richblack-700/60
          transition-colors duration-200 group"
      >
        <div className="flex items-center gap-2.5 sm:gap-3x`">
          {/* AI Icon */}
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9
            rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20
            border border-purple-500/20">
            <FiCpu className="text-sm sm:text-base text-purple-400" />
          </div>
          <div className="text-left">
            <p className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              AI Learning Assistant
              <span className="text-[10px] font-normal px-1.5 py-0.5
                rounded-full bg-purple-500/20 text-purple-300 border
                border-purple-500/20">
                Beta
              </span>
            </p>
            <p className="text-[10px] sm:text-xs text-richblack-400">
              Ask questions • Get summary • Generate notes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Animated dot */}
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {isExpanded ? (
            <HiOutlineChevronUp className="text-richblack-400 text-lg
              group-hover:text-richblack-200 transition-colors" />
          ) : (
            <HiOutlineChevronDown className="text-richblack-400 text-lg
              group-hover:text-richblack-200 transition-colors" />
          )}
        </div>
      </button>

      {/* ── Panel Body ─────────────────────────────────────────────── */}
      <div
        className={`transition-all duration-400 ease-in-out overflow-hidden
          ${isExpanded ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        {/* Tab Navigation */}
        <div className="flex border-b border-richblack-700 bg-richblack-800/50">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2
                  py-2.5 sm:py-3 px-2 sm:px-4
                  text-xs sm:text-sm font-medium
                  transition-all duration-200 border-b-2
                  ${
                    activeTab === tab.id
                      ? "border-yellow-50 text-yellow-50 bg-yellow-50/5"
                      : "border-transparent text-richblack-400 hover:text-richblack-200 hover:bg-richblack-700/30"
                  }`}
              >
                <Icon className="text-sm sm:text-base flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
                <span className="xs:hidden sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab: Ask AI ─────────────────────────────────────────── */}
        {activeTab === "ask" && (
          <div className="flex flex-col h-[400px] sm:h-[450px]">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4
              custom-scrollbar">
              {chatHistory.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center
                  h-full gap-4 sm:gap-6 py-4">
                  <div className="flex items-center justify-center
                    w-14 h-14 sm:w-16 sm:h-16 rounded-2xl
                    bg-gradient-to-br from-purple-500/20 to-blue-500/20
                    border border-purple-500/20">
                    <FiCpu className="text-2xl sm:text-3xl text-purple-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm sm:text-base font-semibold text-richblack-100 mb-1">
                      Ask anything about this lecture
                    </p>
                    <p className="text-xs sm:text-sm text-richblack-400 max-w-[260px]">
                      I'm powered by AI and can answer questions specific to
                      <span className="text-yellow-50 font-medium">
                        {" "}{videoData?.title || "this lecture"}
                      </span>
                    </p>
                  </div>

                  {/* Suggested Questions */}
                  <div className="w-full space-y-2">
                    <p className="text-[10px] sm:text-xs text-richblack-500
                      text-center uppercase tracking-wider">
                      Try asking
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {suggestedQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setQuestion(q)}
                          className="text-left text-[10px] sm:text-xs
                            text-richblack-300 hover:text-white
                            bg-richblack-700/50 hover:bg-richblack-700
                            border border-richblack-600 hover:border-richblack-500
                            rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5
                            transition-all duration-200 line-clamp-2"
                        >
                          "{q}"
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat History */
                <>
                  {chatHistory.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}

                  {/* AI Typing Indicator */}
                  {askingAI && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full
                        bg-gradient-to-br from-purple-500 to-blue-500
                        flex items-center justify-center flex-shrink-0">
                        <FiCpu className="text-white text-sm" />
                      </div>
                      <div className="bg-richblack-700 border border-richblack-600
                        rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-richblack-400 rounded-full
                            animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-1.5 h-1.5 bg-richblack-400 rounded-full
                            animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-1.5 h-1.5 bg-richblack-400 rounded-full
                            animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Clear Chat */}
            {chatHistory.length > 0 && (
              <div className="px-3 sm:px-4 py-1.5 flex justify-end
                border-t border-richblack-700/50">
                <button
                  onClick={() => setChatHistory([])}
                  className="flex items-center gap-1 text-[10px] sm:text-xs
                    text-richblack-500 hover:text-richblack-300
                    transition-colors duration-200"
                >
                  <HiOutlineX className="text-xs" />
                  Clear chat
                </button>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-richblack-700 p-3 sm:p-4">
              <form
                onSubmit={handleAskAI}
                className="flex items-end gap-2 sm:gap-3"
              >
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAskAI();
                      }
                    }}
                    placeholder="Ask about this lecture... (Enter to send)"
                    rows={1}
                    className="w-full bg-richblack-700 border border-richblack-600
                      focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10
                      rounded-xl px-3 sm:px-4 py-2.5 sm:py-3
                      text-xs sm:text-sm text-richblack-100
                      placeholder:text-richblack-500
                      resize-none outline-none
                      transition-all duration-200
                      max-h-[100px] overflow-y-auto custom-scrollbar"
                    style={{ minHeight: "44px" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!question.trim() || askingAI}
                  className="flex-shrink-0 flex items-center justify-center
                    w-10 h-10 sm:w-11 sm:h-11 rounded-xl
                    bg-gradient-to-br from-purple-500 to-blue-500
                    hover:from-purple-400 hover:to-blue-400
                    disabled:from-richblack-600 disabled:to-richblack-600
                    disabled:cursor-not-allowed
                    text-white shadow-lg shadow-purple-500/20
                    transition-all duration-300 hover:scale-[1.05]
                    disabled:shadow-none disabled:hover:scale-100"
                >
                  {askingAI ? (
                    <BiLoaderAlt className="text-base sm:text-lg animate-spin" />
                  ) : (
                    <HiOutlinePaperAirplane className="text-base sm:text-lg rotate-90" />
                  )}
                </button>
              </form>
              <p className="text-[10px] text-richblack-600 mt-1.5 ml-1">
                Shift+Enter for new line • Enter to send
              </p>
            </div>
          </div>
        )}

        {/* ── Tab: Summary ────────────────────────────────────────── */}
        {activeTab === "summary" && (
          <div className="p-4 sm:p-6">
            {loadingSummary ? (
              <div className="flex flex-col items-center justify-center
                gap-4 py-12 sm:py-16">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl
                    bg-gradient-to-br from-blue-500/20 to-purple-500/20
                    border border-blue-500/20
                    flex items-center justify-center">
                    <FiFileText className="text-xl sm:text-2xl text-blue-400" />
                  </div>
                  <BiLoaderAlt className="absolute -top-1 -right-1 text-lg
                    text-purple-400 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-base font-medium text-richblack-200">
                    Generating summary...
                  </p>
                  <p className="text-xs text-richblack-400 mt-1">
                    Analyzing lecture content
                  </p>
                </div>
              </div>
            ) : summary ? (
              <div className="space-y-3 sm:space-y-4">
                {/* Summary Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiFileText className="text-blue-400 text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm font-semibold text-richblack-200">
                      Lecture Summary
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CopyButton text={summary} />
                    <button
                      onClick={() => {
                        setSummary("");
                        setSummaryFetched(false);
                        handleGetSummary();
                      }}
                      className="flex items-center gap-1 text-[10px] sm:text-xs
                        text-richblack-400 hover:text-richblack-200
                        transition-colors duration-200"
                    >
                      <HiOutlineRefresh className="text-xs sm:text-sm" />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Summary Content */}
                <div className="rounded-xl bg-richblack-700/50
                  border border-richblack-600/50
                  p-4 sm:p-5 max-h-[350px] overflow-y-auto custom-scrollbar">
                  <FormattedResponse text={summary} />
                </div>
              </div>
            ) : (
              /* Error / Empty */
              <div className="flex flex-col items-center justify-center
                gap-4 py-12">
                <p className="text-sm text-richblack-400">
                  Failed to load summary
                </p>
                <button
                  onClick={() => {
                    setSummaryFetched(false);
                    handleGetSummary();
                  }}
                  className="flex items-center gap-2 bg-richblack-700
                    hover:bg-richblack-600 border border-richblack-600
                    rounded-xl px-4 py-2 text-xs sm:text-sm text-richblack-200
                    transition-all duration-200"
                >
                  <HiOutlineRefresh />
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Notes ──────────────────────────────────────────── */}
        {activeTab === "notes" && (
          <div className="p-4 sm:p-6">
            {loadingNotes ? (
              <div className="flex flex-col items-center justify-center
                gap-4 py-12 sm:py-16">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl
                    bg-gradient-to-br from-emerald-500/20 to-teal-500/20
                    border border-emerald-500/20
                    flex items-center justify-center">
                    <FiBook className="text-xl sm:text-2xl text-emerald-400" />
                  </div>
                  <BiLoaderAlt className="absolute -top-1 -right-1 text-lg
                    text-emerald-400 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-base font-medium text-richblack-200">
                    Generating study notes...
                  </p>
                  <p className="text-xs text-richblack-400 mt-1">
                    This may take a moment
                  </p>
                </div>
              </div>
            ) : notes ? (
              <div className="space-y-3 sm:space-y-4">
                {/* Notes Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiBook className="text-emerald-400 text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm font-semibold text-richblack-200">
                      Study Notes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CopyButton text={notes} />
                    <button
                      onClick={() => {
                        setNotes("");
                        setNotesFetched(false);
                        handleGenerateNotes();
                      }}
                      className="flex items-center gap-1 text-[10px] sm:text-xs
                        text-richblack-400 hover:text-richblack-200
                        transition-colors duration-200"
                    >
                      <HiOutlineRefresh className="text-xs sm:text-sm" />
                      Regenerate
                    </button>
                  </div>
                </div>

                {/* Notes Content */}
                <div className="rounded-xl bg-richblack-700/50
                  border border-richblack-600/50
                  p-4 sm:p-5 max-h-[350px] overflow-y-auto custom-scrollbar">
                  <FormattedResponse text={notes} />
                </div>

                {/* Download Notes as Text */}
                <button
                  onClick={() => {
                    const blob = new Blob([notes], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${videoData?.title || "lecture"}-notes.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Notes downloaded!");
                  }}
                  className="w-full flex items-center justify-center gap-2
                    rounded-xl border border-richblack-600 hover:border-richblack-500
                    hover:bg-richblack-700/50
                    px-4 py-2.5 text-xs sm:text-sm
                    text-richblack-300 hover:text-richblack-100
                    transition-all duration-200"
                >
                  <HiOutlineDocumentText className="text-sm sm:text-base" />
                  Download Notes (.txt)
                </button>
              </div>
            ) : (
              /* Error / Empty */
              <div className="flex flex-col items-center justify-center
                gap-4 py-12">
                <p className="text-sm text-richblack-400">
                  Failed to generate notes
                </p>
                <button
                  onClick={() => {
                    setNotesFetched(false);
                    handleGenerateNotes();
                  }}
                  className="flex items-center gap-2 bg-richblack-700
                    hover:bg-richblack-600 border border-richblack-600
                    rounded-xl px-4 py-2 text-xs sm:text-sm text-richblack-200
                    transition-all duration-200"
                >
                  <HiOutlineRefresh />
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureAIPanel;