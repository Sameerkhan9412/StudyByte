import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  HiOutlineX,
  HiOutlineStar,
  HiOutlineGlobeAlt,
} from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";
import { createRating } from "../../../services/operations/courseDetailsAPI";
import ReactStars from "react-rating-stars-component";

const CourseReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);
  const [ratingValue, setRatingValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);

    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const ratingChanged = (newRating) => {
    setRatingValue(newRating);
    setValue("courseRating", newRating);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    );
    setSubmitting(false);
    setReviewModal(false);
  };

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setReviewModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center
        p-4 sm:p-6 bg-richblack-900/70 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setReviewModal(false);
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl sm:rounded-3xl bg-richblack-800
          border border-richblack-700 shadow-2xl shadow-richblack-900/80
          overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col"
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-between
          px-5 sm:px-6 py-4 sm:py-5
          bg-richblack-700/50 border-b border-richblack-700">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9
              rounded-lg sm:rounded-xl bg-yellow-50/10">
              <HiOutlineStar className="text-base sm:text-lg text-yellow-50" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Add Review</h2>
              <p className="text-[10px] sm:text-xs text-richblack-400 hidden sm:block">
                Share your experience
              </p>
            </div>
          </div>
          <button
            onClick={() => setReviewModal(false)}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9
              rounded-lg sm:rounded-xl bg-richblack-700 hover:bg-richblack-600
              text-richblack-300 hover:text-white
              transition-all duration-200 hover:rotate-90"
          >
            <HiOutlineX className="text-base sm:text-lg" />
          </button>
        </div>

        {/* ── Body (scrollable) ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8">
          {/* User Info */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative">
              <img
                src={user?.image}
                alt={user?.firstName}
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover
                  ring-2 ring-richblack-600"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full
                bg-emerald-500 border-2 border-richblack-800" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="flex items-center gap-1 text-[10px] sm:text-xs text-richblack-400">
                <HiOutlineGlobeAlt className="text-xs" />
                Posting Publicly
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            {/* Rating Stars */}
            <div className="flex flex-col items-center gap-2 sm:gap-3
              p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-richblack-700/30
              border border-richblack-700">
              <p className="text-xs sm:text-sm text-richblack-300 font-medium">
                How would you rate this course?
              </p>

              <ReactStars
                size={window.innerWidth < 640 ? 32 : 40}
                isHalf={false}
                count={5}
                value={ratingValue}
                color="#4B5563"
                activeColor="#FFD60A"
                onChange={ratingChanged}
              />

              {ratingValue > 0 && (
                <span
                  className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-full
                    transition-all duration-300
                    ${
                      ratingValue >= 4
                        ? "bg-emerald-500/15 text-emerald-400"
                        : ratingValue >= 3
                        ? "bg-yellow-50/15 text-yellow-50"
                        : "bg-orange-500/15 text-orange-400"
                    }`}
                >
                  {ratingLabels[ratingValue]}
                </span>
              )}
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <label
                htmlFor="courseExperience"
                className="text-xs sm:text-sm font-semibold text-richblack-200"
              >
                Your Experience{" "}
                <span className="text-pink-200">*</span>
              </label>
              <textarea
                id="courseExperience"
                placeholder="What did you enjoy about this course? What could be improved? Share your thoughts..."
                {...register("courseExperience", {
                  required: "Please share your experience",
                })}
                className="w-full min-h-[100px] sm:min-h-[140px] max-h-[200px]
                  rounded-xl sm:rounded-2xl
                  bg-richblack-700 border border-richblack-600
                  focus:border-yellow-50/50 focus:ring-2 focus:ring-yellow-50/10
                  px-4 py-3 text-sm text-richblack-5
                  placeholder:text-richblack-500
                  transition-all duration-200 resize-y
                  outline-none"
              />
              {errors.courseExperience && (
                <div className="flex items-center gap-1.5 text-pink-300">
                  <span className="text-xs">⚠</span>
                  <span className="text-[10px] sm:text-xs">
                    {errors.courseExperience.message}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center
              justify-end gap-2 sm:gap-3 pt-2 sm:pt-4
              border-t border-richblack-700/50">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="flex items-center justify-center
                  rounded-lg sm:rounded-xl border border-richblack-600
                  hover:border-richblack-500 hover:bg-richblack-700
                  px-5 sm:px-6 py-2.5 sm:py-3
                  text-xs sm:text-sm font-medium text-richblack-300 hover:text-richblack-100
                  transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2
                  rounded-lg sm:rounded-xl bg-yellow-50 hover:bg-yellow-100
                  disabled:bg-richblack-600 disabled:text-richblack-400
                  px-5 sm:px-8 py-2.5 sm:py-3
                  text-xs sm:text-sm font-bold text-richblack-900
                  transition-all duration-300 hover:scale-[1.02]
                  shadow-md shadow-yellow-50/10
                  disabled:shadow-none disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <BiLoaderAlt className="text-base animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;