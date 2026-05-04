import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "video-react/dist/video-react.css";
import { useLocation } from "react-router-dom";
import { BigPlayButton, Player } from "video-react";
import {
  getStudentQuiz,
  markLectureAsComplete,
} from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import Quiz from "./Quiz";
import toast from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlinePlay,
} from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";
import { FiBookOpen } from "react-icons/fi";
import LectureAIPanel from "./LectureAIPanel";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const quizRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // ─── NEW: tracks if lecture was auto-completed (no quiz case) ────
  const [autoCompleted, setAutoCompleted] = useState(false);

  useEffect(() => {
    (async () => {
      if (!courseSectionData.length) return;
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`);
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        );
        const filteredVideoData = filteredData?.[0]?.SubSection.filter(
          (data) => data._id === subSectionId
        );
        setVideoData(filteredVideoData?.[0] || null);
        setPreviewSource(courseEntireData.thumbnail);
        setVideoEnded(false);
        setShowQuiz(false);
        setQuizPassed(false);
        setQuizQuestions([]);
        setAutoCompleted(false); // ← reset on video change
      }
    })();
  }, [courseSectionData, courseEntireData, location.pathname]);

  // ─── Fetch Quiz Questions ─────────────────────────────────────────
  const fetchQuizQuestions = async () => {
    setLoadingQuiz(true);
    try {
      const res = await getStudentQuiz({ subSectionId }, token);

      const questions = res?.questions || [];
      const hasQuiz = res?.hasQuiz && questions.length > 0;

      if (!hasQuiz) {
        // ── No quiz OR empty questions array ──
        // Auto-complete the lecture and show navigation overlay
        await handleLectureCompletion();
        setAutoCompleted(true); // ← triggers overlay with nav buttons
        setShowQuiz(false);
        setLoadingQuiz(false);
        return;
      }

      // ── Has valid quiz questions ──
      setQuizQuestions(questions);
      setShowQuiz(true);

      // Smooth scroll to quiz section
      setTimeout(() => {
        quizRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);

    } catch (error) {
      toast.error("Failed to load quiz");
      // On error → still auto-complete so student isn't stuck
      await handleLectureCompletion();
      setAutoCompleted(true);
    }

    setLoadingQuiz(false);
  };

  // ─── Handle Video End ─────────────────────────────────────────────
  const handleVideoEnd = async () => {
    setVideoEnded(true);
    if (!completedLectures.includes(subSectionId)) {
      await fetchQuizQuestions();
    }
    // If already completed → overlay shows via isCompleted flag naturally
  };

  const handleQuizPass = async () => {
    setQuizPassed(true);
    await handleLectureCompletion();
  };

  const handleQuizFail = () => {
    setQuizPassed(false);
  };

  // ─── Navigation Helpers ───────────────────────────────────────────
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].SubSection.findIndex((data) => data._id === subSectionId);
    return currentSectionIndx === 0 && currentSubSectionIndx === 0;
  };

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubsections =
      courseSectionData[currentSectionIndx].SubSection.length;
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].SubSection.findIndex((data) => data._id === subSectionId);
    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    );
  };

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubsections =
      courseSectionData[currentSectionIndx].SubSection.length;
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].SubSection.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].SubSection[
          currentSubSectionIndx + 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id;
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].SubSection[0]._id;
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].SubSection.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].SubSection[
          currentSubSectionIndx - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id;
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].SubSection.length;
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].SubSection[
          prevSubSectionLength - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId, subSectionId },
      token
    );
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  // ─── Lecture Info ─────────────────────────────────────────────────
  const getCurrentLectureInfo = () => {
    if (!courseSectionData.length)
      return { current: 0, total: 0, sectionName: "" };
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (currentSectionIndx === -1)
      return { current: 0, total: 0, sectionName: "" };

    let lectureNumber = 0;
    let totalLectures = 0;

    for (let i = 0; i < courseSectionData.length; i++) {
      const subs = courseSectionData[i].SubSection;
      totalLectures += subs.length;
      if (i < currentSectionIndx) {
        lectureNumber += subs.length;
      } else if (i === currentSectionIndx) {
        const subIdx = subs.findIndex((s) => s._id === subSectionId);
        lectureNumber += subIdx + 1;
      }
    }

    return {
      current: lectureNumber,
      total: totalLectures,
      sectionName: courseSectionData[currentSectionIndx]?.sectionName || "",
    };
  };

  const lectureInfo = getCurrentLectureInfo();
  const isCompleted = completedLectures.includes(subSectionId);

  // ─── Shared: Nav Buttons (used in both overlay + post-quiz) ──────
  const NavigationButtons = ({ includeRewatch = true, overlayStyle = false }) => (
    <div className={`flex items-center gap-2 sm:gap-3 ${overlayStyle ? "mt-2" : "w-full sm:w-auto"}`}>
      {includeRewatch && (
        <button
          onClick={() => {
            if (playerRef?.current) {
              playerRef?.current?.seek(0);
              setVideoEnded(false);
              setShowQuiz(false);
              setAutoCompleted(false);
            }
          }}
          className={`
            flex items-center justify-center gap-1.5 group
            ${overlayStyle
              ? "bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white"
              : "flex-1 sm:flex-none rounded-lg sm:rounded-xl border border-richblack-600 hover:border-richblack-500 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-richblack-300 hover:text-richblack-100 hover:bg-richblack-700/50"
            }
            transition-all duration-300 hover:scale-[1.02]
          `}
        >
          <HiOutlineRefresh
            className={`${overlayStyle ? "text-base sm:text-lg group-hover:rotate-180 transition-transform duration-500" : "text-sm"}`}
          />
          Rewatch {overlayStyle ? "Lecture" : ""}
        </button>
      )}

      {!isFirstVideo() && (
        <button
          disabled={loading}
          onClick={goToPrevVideo}
          className={`
            flex items-center justify-center gap-1.5
            ${overlayStyle
              ? "bg-richblack-700/80 hover:bg-richblack-600 border border-richblack-600 hover:border-richblack-500 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-richblack-100"
              : "flex-1 sm:flex-none rounded-lg sm:rounded-xl bg-richblack-700 hover:bg-richblack-600 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white"
            }
            transition-all duration-300 disabled:opacity-50
          `}
        >
          <HiOutlineArrowLeft className="text-sm" />
          Previous
        </button>
      )}

      {!isLastVideo() && (
        <button
          disabled={loading}
          onClick={goToNextVideo}
          className={`
            flex items-center justify-center gap-1.5
            ${overlayStyle
              ? "bg-yellow-50 hover:bg-yellow-100 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-richblack-900 shadow-lg shadow-yellow-50/20"
              : "flex-1 sm:flex-none rounded-lg sm:rounded-xl bg-yellow-50 hover:bg-yellow-100 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-richblack-900 shadow-md shadow-yellow-50/10"
            }
            transition-all duration-300 hover:scale-[1.02] disabled:opacity-50
          `}
        >
          Next Lecture
          <HiOutlineArrowRight className="text-sm" />
        </button>
      )}
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">

      {/* ── Lecture Info Bar ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8
            rounded-lg bg-richblack-700 text-xs sm:text-sm font-bold text-yellow-50">
            {lectureInfo.current}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-richblack-400 uppercase tracking-wider font-medium truncate">
              {lectureInfo.sectionName}
            </p>
            <p className="text-xs sm:text-sm text-richblack-200">
              Lecture {lectureInfo.current} of {lectureInfo.total}
            </p>
          </div>
        </div>
        {isCompleted && (
          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium
            text-emerald-400 bg-emerald-400/10 px-2.5 sm:px-3 py-1 sm:py-1.5
            rounded-full border border-emerald-400/20 self-start sm:self-auto">
            <HiOutlineCheckCircle className="text-sm sm:text-base" />
            Completed
          </span>
        )}
      </div>

      {/* ── Video Player ──────────────────────────────────────────── */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-richblack-900
        shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-richblack-700/50">
        {!videoData ? (
          <div className="relative aspect-video">
            <img src={previewSource} alt="Preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-richblack-900/60 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center gap-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-richblack-700
                  flex items-center justify-center">
                  <HiOutlinePlay className="text-xl sm:text-2xl text-richblack-400" />
                </div>
                <p className="text-xs sm:text-sm text-richblack-400">Loading video...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <Player
              ref={playerRef}
              aspectRatio="16:9"
              playsInline
              onEnded={handleVideoEnd}
              src={videoData?.videoUrl}
            >
              <BigPlayButton position="center" />

              {/* ── End Overlay (shown when no quiz / already completed) ── */}
              {videoEnded && !showQuiz && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center
                  bg-gradient-to-t from-richblack-900 via-richblack-900/90
                  to-richblack-900/70 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4 sm:gap-6 px-4 w-full max-w-md">

                    {/* Loading Quiz */}
                    {loadingQuiz && (
                      <div className="flex flex-col items-center gap-3">
                        <BiLoaderAlt className="text-3xl sm:text-4xl text-yellow-50 animate-spin" />
                        <p className="text-sm sm:text-base text-yellow-50/80 font-medium">
                          Preparing your quiz...
                        </p>
                      </div>
                    )}

                    {/* ─── CASE 1: Already completed (revisiting) ──────── */}
                    {!loadingQuiz && isCompleted && !autoCompleted && (
                      <>
                        <div className="flex items-center gap-2 bg-emerald-500/10
                          border border-emerald-500/20 rounded-full px-4 py-2">
                          <HiOutlineCheckCircle className="text-lg sm:text-xl text-emerald-400" />
                          <span className="text-xs sm:text-sm font-medium text-emerald-400">
                            Lecture Completed
                          </span>
                        </div>
                        <NavigationButtons overlayStyle={true} />
                      </>
                    )}

                    {/* ─── CASE 2: Just auto-completed (no quiz) ────────── */}
                    {!loadingQuiz && autoCompleted && (
                      <>
                        <div className="flex items-center gap-2 bg-emerald-500/10
                          border border-emerald-500/20 rounded-full px-4 py-2">
                          <HiOutlineCheckCircle className="text-lg sm:text-xl text-emerald-400" />
                          <span className="text-xs sm:text-sm font-medium text-emerald-400">
                            Lecture Completed ✓
                          </span>
                        </div>
                        <p className="text-xs text-richblack-400 -mt-2">
                          No quiz for this lecture
                        </p>
                        <NavigationButtons overlayStyle={true} />
                      </>
                    )}

                  </div>
                </div>
              )}
            </Player>
          </div>
        )}
      </div>

      {/* ── Quiz Section ─────────────────────────────────────────── */}
      {videoEnded && showQuiz && quizQuestions.length > 0 && (
        <div ref={quizRef} className="mt-6 sm:mt-8 animate-fadeInUp">
          {/* Quiz Banner */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center
            gap-3 sm:gap-4 rounded-xl sm:rounded-2xl
            bg-gradient-to-r from-yellow-50/10 to-yellow-50/5
            px-4 sm:px-6 py-4 sm:py-5 border border-yellow-50/15">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12
              rounded-xl bg-yellow-50/15 flex-shrink-0">
              <FiBookOpen className="text-lg sm:text-xl text-yellow-50" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-yellow-50 mb-0.5 sm:mb-1">
                Knowledge Check
              </h3>
              <p className="text-xs sm:text-sm text-richblack-300 leading-relaxed">
                Score at least{" "}
                <span className="text-yellow-50 font-semibold">70%</span> to
                mark this lecture as completed and proceed.
              </p>
            </div>
          </div>

          <Quiz
            questions={quizQuestions}
            courseId={courseId}
            subSectionId={subSectionId}
            token={token}
            onPass={handleQuizPass}
            onFail={handleQuizFail}
          />

          {/* Post-Quiz Pass Navigation */}
          {quizPassed && (
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center
              justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl
              bg-gradient-to-r from-emerald-500/10 to-emerald-500/5
              p-4 sm:p-5 border border-emerald-500/20 animate-fadeInUp">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10
                  rounded-full bg-emerald-500/20">
                  <HiOutlineCheckCircle className="text-lg sm:text-xl text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-yellow-200">
                    Lecture Completed!
                  </p>
                  <p className="text-[10px] sm:text-xs text-richblack-400">
                    Your progress has been saved
                  </p>
                </div>
              </div>
              <NavigationButtons overlayStyle={false} includeRewatch={true} />
            </div>
          )}
        </div>
      )}

      {/* ── Video Info ───────────────────────────────────────────── */}
           {/* ── Video Metadata ────────────────────────────────────────── */}
      <div className="mt-4 sm:mt-6 pb-6 sm:pb-8 border-b border-richblack-700/50">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold
          text-richblack-5 leading-tight">
          {videoData?.title}
        </h1>
        {videoData?.description && (
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-richblack-300
            leading-relaxed max-w-3xl">
            {videoData?.description}
          </p>
        )}
      </div>

      {/* ── AI Learning Assistant Panel ───────────────────────────── */}
      {/* ADD THIS BLOCK right after Video Metadata */}
      {videoData && (
        <LectureAIPanel
          subSectionId={subSectionId}
          courseId={courseId}
          token={token}
          videoData={videoData}
        />
      )}
    </div>
  );
};

export default VideoDetails;