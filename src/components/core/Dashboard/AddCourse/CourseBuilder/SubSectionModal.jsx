import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  createSubSection,
  updateSubSection,
  generateQuiz,
} from "../../../../../services/operations/courseDetailsAPI";

import { setCourse } from "../../../../../slices/courseSlice";
import { RxCross2 } from "react-icons/rx";
import Upload from "../Upload";
import IconBtn from "../../../../common/IconBtn";
import QuizReviewModal from "./QuizReviewModal";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // current lecture object
  const lectureSaved = !!modalData?._id;
  const transcriptReady =
    modalData?.transcriptStatus === "completed";

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, []);

  // Check if edit form changed
  const isFormUpdated = () => {
    const currentValues = getValues();

    return (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    );
  };

  // ===============================
  // Update Lecture
  // ===============================
  const handleEditSubsection = async () => {
    try {
      const currentValues = getValues();

      const formData = new FormData();
      formData.append("sectionId", modalData.sectionId);
      formData.append("subSectionId", modalData._id);

      if (currentValues.lectureTitle !== modalData.title) {
        formData.append("title", currentValues.lectureTitle);
      }

      if (currentValues.lectureDesc !== modalData.description) {
        formData.append("description", currentValues.lectureDesc);
      }

      if (currentValues.lectureVideo !== modalData.videoUrl) {
        formData.append("video", currentValues.lectureVideo);
      }

      setLoading(true);

      const result = await updateSubSection(formData, token);

      if (result) {
        const updatedCourseContent = course.courseContent.map(
          (section) =>
            section._id === modalData.sectionId
              ? result
              : section
        );

        dispatch(
          setCourse({
            ...course,
            courseContent: updatedCourseContent,
          })
        );

        toast.success("Lecture updated");
        setModalData(null);
      }
    } catch (error) {
      toast.error("Failed to update lecture");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Generate Quiz
  // ===============================
  const handleGenerateQuiz = async () => {
    if (!lectureSaved) {
      toast.error("Please save lecture first");
      return;
    }

    if (!transcriptReady) {
      toast.error("Transcript not ready yet");
      return;
    }

    try {
      setQuizLoading(true);

      const result = await generateQuiz(
        { subSectionId: modalData._id },
        token
      );

      if (result) {
        toast.success("Quiz generated successfully");
        setShowQuizModal(true);
      }
    } catch (error) {
      toast.error("Failed to generate quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  // ===============================
  // Submit
  // ===============================
  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made");
      } else {
        handleEditSubsection();
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("sectionId", modalData);
      formData.append("title", data.lectureTitle);
      formData.append("description", data.lectureDesc);
      formData.append("video", data.lectureVideo);

      setLoading(true);

      const result = await createSubSection(formData, token);

      if (result) {
        const updatedCourseContent = course.courseContent.map(
          (section) =>
            section._id === modalData ? result : section
        );

        dispatch(
          setCourse({
            ...course,
            courseContent: updatedCourseContent,
          })
        );

        const latestLecture =
          result.SubSection[result.SubSection.length - 1];

        setModalData({
          ...latestLecture,
          sectionId: modalData,
        });

        toast.success("Lecture saved successfully");
      }
    } catch (error) {
      toast.error("Failed to create lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-white/10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[760px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl border-b border-richblack-700 bg-richblack-800 px-6 py-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"}{" "}
            {edit && "Editing"} Lecture
          </p>

          <button
            onClick={() =>
              !loading ? setModalData(null) : {}
            }
          >
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-7 px-6 py-6"
        >
          {/* Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          {/* Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5">
              Lecture Title{" "}
              {!view && (
                <sup className="text-pink-200">*</sup>
              )}
            </label>

            <input
              disabled={view || loading}
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", {
                required: true,
              })}
              className="form-style w-full"
            />

            {errors.lectureTitle && (
              <span className="text-xs text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5">
              Lecture Description{" "}
              {!view && (
                <sup className="text-pink-200">*</sup>
              )}
            </label>

            <textarea
              disabled={view || loading}
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", {
                required: true,
              })}
              className="form-style min-h-[130px] w-full resize-none"
            />

            {errors.lectureDesc && (
              <span className="text-xs text-pink-200">
                Lecture description is required
              </span>
            )}
          </div>

          {/* Quiz Status */}
          {!view && (
            <div className="rounded-md bg-richblack-700 p-4">
              {!lectureSaved && (
                <p className="text-sm text-yellow-50">
                  Save lecture first to enable quiz
                  generation.
                </p>
              )}

              {lectureSaved &&
                modalData?.transcriptStatus ===
                  "processing" && (
                  <p className="text-sm text-yellow-50">
                    Transcript is generating...
                  </p>
                )}

              {lectureSaved &&
                modalData?.transcriptStatus ===
                  "failed" && (
                  <p className="text-sm text-pink-200">
                    Transcript failed. Please update
                    video and try again.
                  </p>
                )}

              {lectureSaved && transcriptReady && (
                <p className="text-sm text-green-400">
                  Transcript ready. You can generate
                  quiz now.
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          {!view && (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleGenerateQuiz}
                disabled={
                  !lectureSaved ||
                  !transcriptReady ||
                  quizLoading
                }
                className={`rounded-md px-4 py-2 font-semibold ${
                  !lectureSaved || !transcriptReady
                    ? "cursor-not-allowed bg-richblack-600 text-richblack-300"
                    : "bg-yellow-50 text-richblack-900"
                }`}
              >
                {quizLoading
                  ? "Generating..."
                  : "Generate Quiz"}
              </button>

              <IconBtn
                disabled={loading}
                text={
                  loading
                    ? "Loading..."
                    : edit
                    ? "Save Changes"
                    : "Save"
                }
              />
            </div>
          )}
        </form>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <QuizReviewModal
          subSectionId={modalData._id}
          setShowQuizModal={setShowQuizModal}
        />
      )}
    </div>
  );
}