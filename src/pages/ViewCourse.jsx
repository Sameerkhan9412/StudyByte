import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";
import VideoDetailsSidebar from "../components/core/ViewCourses/VideoDetailsSidebar";
import CourseReviewModal from "../components/core/ViewCourses/CourseReviewModel";
import { BiLoaderAlt } from "react-icons/bi";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);
  const dispatch = useDispatch();

  // ─── Fetch Course Data ──────────────────────────────────────────
  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const courseData = await getFullDetailsOfCourse(courseId, token);

        if (!courseData || !courseData.courseDetails) {
          setError("Course not found or you don't have access.");
          return;
        }

        dispatch(
          setCourseSectionData(courseData.courseDetails.courseContent)
        );
        dispatch(setEntireCourseData(courseData.courseDetails));
        dispatch(setCompletedLectures(courseData.completedVideos));

        let lectures = 0;
        courseData.courseDetails?.courseContent?.forEach((sec) => {
          lectures += sec.SubSection.length;
        });
        dispatch(setTotalNoOfLectures(lectures));
      } catch (err) {
        console.error("Error loading course:", err);
        setError("Failed to load course. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    setCourseSpecificDetails();
  }, [courseId]);

  // ─── Loading Screen ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-richblack-900">
        <div className="flex flex-col items-center gap-4 sm:gap-6 px-4 text-center">
          {/* Animated Logo / Spinner */}
          <div className="relative">
            {/* Outer Ring */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4
                border-richblack-700 border-t-yellow-50
                animate-spin"
            />
            {/* Inner Pulse */}
            <div
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full
                  bg-yellow-50/20 animate-pulse"
              />
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <p className="text-base sm:text-lg font-semibold text-richblack-100">
              Loading your course...
            </p>
            <p className="text-xs sm:text-sm text-richblack-400">
              Preparing your learning experience
            </p>
          </div>

          {/* Loading Steps */}
          <div className="flex flex-col gap-2 mt-2 w-full max-w-[200px] sm:max-w-[240px]">
            {["Fetching course data", "Loading lectures", "Setting up player"].map(
              (step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <BiLoaderAlt
                    className="text-xs text-yellow-50 animate-spin flex-shrink-0"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                  <span className="text-[10px] sm:text-xs text-richblack-400 text-left">
                    {step}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Error Screen ───────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-richblack-900 px-4">
        <div
          className="flex flex-col items-center gap-4 sm:gap-6 text-center
            w-full max-w-sm sm:max-w-md"
        >
          <div
            className="flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20
              rounded-2xl sm:rounded-3xl bg-red-500/10
              ring-2 ring-red-500/20"
          >
            <HiOutlineExclamationCircle className="text-2xl sm:text-4xl text-red-400" />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-lg sm:text-2xl font-bold text-richblack-5">
              Something went wrong
            </h2>
            <p className="text-sm sm:text-base text-richblack-400">{error}</p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-xl
              bg-yellow-50 hover:bg-yellow-100
              px-5 sm:px-6 py-2.5 sm:py-3
              text-sm sm:text-base font-bold text-richblack-900
              transition-all duration-300 hover:scale-[1.02]
              shadow-lg shadow-yellow-50/10"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Layout ────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-richblack-900 pt-[3.5rem]">
      {/* ── Sidebar ────────────────────────────────────────────── */}
      <VideoDetailsSidebar setReviewModal={setReviewModal} />

      {/* ── Main Content Area ──────────────────────────────────── */}
      <main
        className="
          flex-1 min-w-0
          h-[calc(100vh-3.5rem)]
          overflow-y-auto overflow-x-hidden
          scroll-smooth
          custom-scrollbar
        "
      >
        {/* Content Wrapper */}
        <div className="min-h-full">
          {/* Course Name Top Banner (visible on mobile only) */}
          {courseEntireData?.courseName && (
            <div
              className="lg:hidden sticky top-0 z-40
                bg-richblack-800/95 backdrop-blur-md
                border-b border-richblack-700/50
                px-4 py-2.5"
            >
              <p className="text-xs font-medium text-richblack-300 truncate">
                📚 {courseEntireData.courseName}
              </p>
            </div>
          )}

          {/* Page Content */}
          <div className="w-full">
            <Outlet />
          </div>

          {/* Bottom Safe Area Spacer (mobile) */}
          <div className="h-20 lg:h-8" />
        </div>
      </main>

      {/* ── Review Modal ───────────────────────────────────────── */}
      {reviewModal && (
        <CourseReviewModal setReviewModal={setReviewModal} />
      )}
    </div>
  );
};

export default ViewCourse;