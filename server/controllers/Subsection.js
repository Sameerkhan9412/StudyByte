const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Quiz = require("../models/Quiz");

const generateTranscript = require("../utils/generateTranscript");
const generateQuizFromTranscript = require("../utils/generateQuiz");

const { uploadImageToCloudinary } = require("../utils/imageUploader");

// ======================================================
// Create SubSection
// ======================================================
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;
    const video = req.files?.video;

    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 1. Upload video
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // 2. Generate transcript
    const transcriptResult = await generateTranscript(
      uploadDetails.secure_url
    );

    // 3. Create lecture
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration: `${uploadDetails.duration}`,
      description,
      videoUrl: uploadDetails.secure_url,

      transcript: transcriptResult.transcript,
      transcriptStatus: transcriptResult.transcriptStatus,
      transcriptError: transcriptResult.transcriptError,
    });

    // 4. Add lecture to section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { SubSection: subSectionDetails._id },
      },
      { new: true }
    ).populate("SubSection");

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "Lecture created successfully",
    });

  } catch (error) {
    console.error("Create SubSection Error:", error);

    return res.status(500).json({
      success: false,
      message: "Lecture creation failed",
      error: error.message,
    });
  }
};
// ======================================================
// Update SubSection
// ======================================================
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, SubSectionId, title, description } = req.body;

    const subSection = await SubSection.findById(SubSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;

    let videoUpdated = false;

    if (req.files?.video) {
      const video = req.files.video;

      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );

      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;

      // Reset transcript
      subSection.transcript = "";
      subSection.transcriptStatus = "pending";
      subSection.transcriptError = "";

      // Optional: remove old quiz because lecture changed
      await Quiz.findOneAndDelete({
        subSectionId: subSection._id,
      });

      videoUpdated = true;
    }

    await subSection.save();

    // Regenerate transcript in background
    if (videoUpdated) {
      generateTranscript(
        subSection._id,
        subSection.videoUrl
      ).catch(console.error);
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "SubSection"
    );

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection updated successfully",
    });

  } catch (error) {
    console.error("Update SubSection Error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while updating subsection",
      error: error.message,
    });
  }
};

// ======================================================
// Delete SubSection
// ======================================================
exports.deleteSubSection = async (req, res) => {
  try {
    const { SubSectionId, sectionId } = req.body;

    // Remove from section
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { SubSection: SubSectionId },
    });

    // Delete quiz also
    await Quiz.findOneAndDelete({
      subSectionId: SubSectionId,
    });

    // Delete subsection
    const deletedSubSection =
      await SubSection.findByIdAndDelete(SubSectionId);

    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "SubSection"
    );

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection deleted successfully",
    });

  } catch (error) {
    console.error("Delete SubSection Error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting subsection",
      error: error.message,
    });
  }
};

// ======================================================
// Generate Quiz for Lecture
// ======================================================
exports.generateQuiz = async (req, res) => {
  try {
    const { subSectionId } = req.body;

    const lecture = await SubSection.findById(subSectionId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    if (
      lecture.transcriptStatus !== "completed" ||
      !lecture.transcript
    ) {
      return res.status(400).json({
        success: false,
        message: "Transcript not ready yet",
      });
    }

    const questions = await generateQuizFromTranscript(
      lecture.transcript
    );

    const quiz = await Quiz.findOneAndUpdate(
      { subSectionId },
      {
        questions,
        published: false,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: quiz,
      message: "Quiz generated successfully",
    });

  } catch (error) {
    console.error("Generate Quiz Error:", error);

    return res.status(500).json({
      success: false,
      message: "Quiz generation failed",
      error: error.message,
    });
  }
};

exports.getQuizBySubSection = async (req, res) => {
  try {
    const { subSectionId } = req.body;

    const quiz = await Quiz.findOne({ subSectionId });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};