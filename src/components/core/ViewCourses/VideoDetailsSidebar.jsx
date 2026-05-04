import { useEffect, useState, useCallback } from "react";
import { BsChevronDown } from "react-icons/bs";
import {
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import {
  HiOutlineCheckCircle,
  HiOutlinePlay,
  HiOutlineStar,
  HiOutlineX,
  HiOutlineMenu,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { courseId, sectionId, subSectionId } = useParams();
  const location = useLocation();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    if (!courseSectionData.length) return;
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData?.[
      currentSectionIndx
    ]?.SubSection.findIndex((data) => data._id === subSectionId);
    const activeSubSectionId =
      courseSectionData[currentSectionIndx]?.SubSection?.[
        currentSubSectionIndx
      ]?._id;
    setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
    setVideoBarActive(activeSubSectionId);
  }, [courseSectionData, courseEntireData, location.pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const completionPercentage = totalNoOfLectures
    ? Math.round((completedLectures.length / totalNoOfLectures) * 100)
    : 0;

  const handleToggleSection = useCallback((sectionId) => {
    setActiveStatus((prev) => (prev === sectionId ? "" : sectionId));
  }, []);

  // ─── Sidebar Content ─────────────────────────────────────────
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-richblack-800">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-richblack-700 p-4 sm:p-5">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(`/dashboard/enrolled-courses`)}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-richblack-300
              hover:text-white transition-colors duration-200 group"
          >
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8
              rounded-lg bg-richblack-700 group-hover:bg-richblack-600
              transition-colors duration-200">
              <IoIosArrowBack className="text-sm sm:text-base" />
            </div>
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden flex items-center justify-center w-8 h-8
              rounded-lg bg-richblack-700 hover:bg-richblack-600
              text-richblack-300 hover:text-white transition-all duration-200"
          >
            <HiOutlineX className="text-lg" />
          </button>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="hidden lg:flex items-center justify-center w-8 h-8
              rounded-lg bg-richblack-700 hover:bg-richblack-600
              text-richblack-300 hover:text-white transition-all duration-200"
            title="Collapse sidebar"
          >
            <IoIosArrowBack className="text-base" />
          </button>
        </div>

        {/* Course Name */}
        <h2 className="text-sm sm:text-base font-bold text-richblack-5 leading-tight mb-3 line-clamp-2">
          {courseEntireData?.courseName}
        </h2>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-richblack-400">Progress</span>
            <span className="font-semibold text-richblack-200">
              {completedLectures?.length}/{totalNoOfLectures} lectures
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 w-full rounded-full bg-richblack-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-50 to-yellow-200
                transition-all duration-700 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs text-richblack-500">
              {completionPercentage}% complete
            </span>
            {completionPercentage === 100 && (
              <span className="text-[10px] sm:text-xs text-emerald-400 font-medium flex items-center gap-1 text-caribbeangreen-300">
                <HiOutlineCheckCircle className="text-xs" />
                Done!
              </span>
            )}
          </div>
        </div>

        {/* Add Review Button */}
        <button
          onClick={() => setReviewModal(true)}
          className="mt-3 sm:mt-4 w-full flex items-center justify-center gap-1.5 sm:gap-2
            rounded-lg sm:rounded-xl bg-yellow-50 hover:bg-yellow-100
            px-4 py-2 sm:py-2.5
            text-xs sm:text-sm font-bold text-richblack-900
            transition-all duration-300 hover:scale-[1.01]
            shadow-sm shadow-yellow-50/10"
        >
          <HiOutlineStar className="text-sm sm:text-base" />
          Add Review
        </button>
      </div>

      {/* ── Course Sections ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {courseSectionData.map((course, index) => (
          <div key={index} className="border-b border-richblack-700/50">
            {/* Section Header */}
            <button
              className="w-full flex items-center justify-between gap-3
                px-4 sm:px-5 py-3 sm:py-4
                bg-richblack-700/30 hover:bg-richblack-700/50
                transition-colors duration-200 group text-left"
              onClick={() => handleToggleSection(course?._id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-richblack-100 truncate
                  group-hover:text-white transition-colors">
                  {course?.sectionName}
                </p>
                <p className="text-[10px] sm:text-xs text-richblack-400 mt-0.5">
                  {course?.SubSection.length} lesson
                  {course?.SubSection.length > 1 ? "s" : ""}
                  {" · "}
                  {
                    course?.SubSection.filter((sub) =>
                      completedLectures.includes(sub._id)
                    ).length
                  }
                  /{course?.SubSection.length} done
                </p>
              </div>

              {/* Section Progress Mini-Ring */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 relative flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      className="text-richblack-600"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray={`${
                        (course?.SubSection.filter((sub) =>
                          completedLectures.includes(sub._id)
                        ).length /
                          course?.SubSection.length) *
                        62.83
                      } 62.83`}
                      strokeLinecap="round"
                      className="text-yellow-50 transition-all duration-500"
                    />
                  </svg>
                </div>

                <BsChevronDown
                  className={`text-xs text-richblack-400 transition-transform duration-300
                    ${activeStatus === course?._id ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {/* Sub Sections - Animated */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
                ${
                  activeStatus === course?._id
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
            >
              {course.SubSection.map((topic, i) => {
                const isActive = videoBarActive === topic._id;
                const isCompleted = completedLectures.includes(topic._id);

                return (
                  <button
                    key={i}
                    className={`w-full flex items-center gap-2.5 sm:gap-3
                      px-4 sm:px-5 py-2.5 sm:py-3 text-left
                      transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-yellow-50/10 border-l-[3px] border-yellow-50"
                          : "border-l-[3px] border-transparent hover:bg-richblack-700/40 hover:border-richblack-600"
                      }`}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                      );
                      setVideoBarActive(topic._id);
                    }}
                  >
                    {/* Status Indicator */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/20
                          flex items-center justify-center text-caribbeangreen-400">
                          <HiOutlineCheckCircle className="text-xs sm:text-sm text-emerald-400 font-bold" />
                        </div>
                      ) : isActive ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-50/20
                          flex items-center justify-center">
                          <HiOutlinePlay className="text-[10px] sm:text-xs text-yellow-50 ml-0.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-richblack-600
                          group-hover:border-richblack-500 transition-colors" />
                      )}
                    </div>

                    {/* Lecture Title */}
                    <span
                      className={`text-xs sm:text-sm leading-relaxed truncate
                      ${
                        isActive
                          ? "text-yellow-50 font-semibold"
                          : isCompleted
                          ? "text-richblack-300"
                          : "text-richblack-200 group-hover:text-richblack-100"
                      }`}
                    >
                      {topic.title}
                    </span>

                    {/* Now Playing Indicator */}
                    {isActive && (
                      <div className="ml-auto flex-shrink-0 flex gap-[2px]">
                        <div className="w-[2px] h-2 sm:h-3 bg-yellow-50 rounded-full animate-pulse" />
                        <div className="w-[2px] h-3 sm:h-4 bg-yellow-50 rounded-full animate-pulse"
                          style={{ animationDelay: "150ms" }} />
                        <div className="w-[2px] h-1.5 sm:h-2 bg-yellow-50 rounded-full animate-pulse"
                          style={{ animationDelay: "300ms" }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom Spacer */}
        <div className="h-20" />
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Floating Button ─────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-[60]
          flex items-center gap-2 bg-yellow-50 text-richblack-900
          rounded-full px-4 py-3 shadow-xl shadow-yellow-50/20
          font-bold text-sm hover:scale-105 transition-all duration-300"
      >
        <HiOutlineMenu className="text-lg" />
        <span className="hidden sm:inline">Lectures</span>
      </button>

      {/* ── Mobile Sidebar Overlay ─────────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[70] bg-richblack-900/60 backdrop-blur-sm
            animate-fadeIn"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar ─────────────────────────────────────── */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-[80]
          h-full w-[85vw] max-w-[360px]
          transform transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          shadow-2xl shadow-richblack-900/50`}
      >
        <SidebarContent />
      </div>

      {/* ── Desktop Sidebar ────────────────────────────────────── */}
      <div
        className={`hidden lg:block h-[calc(100vh-3.5rem)] flex-shrink-0
          border-r border-richblack-700 transition-all duration-300 ease-out
          ${sidebarOpen ? "w-[320px]" : "w-0 overflow-hidden"}`}
      >
        {sidebarOpen && <SidebarContent />}
      </div>

      {/* ── Desktop Expand Button (when collapsed) ─────────────── */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex fixed top-1/2 -translate-y-1/2 left-0 z-50
            items-center justify-center
            w-8 h-16 rounded-r-xl
            bg-richblack-700 hover:bg-richblack-600
            border border-l-0 border-richblack-600
            text-richblack-300 hover:text-white
            transition-all duration-300 hover:w-10
            shadow-lg shadow-richblack-900/50"
          title="Open sidebar"
        >
          <IoIosArrowForward className="text-base" />
        </button>
      )}
    </>
  );
}