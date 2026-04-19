const axios = require("axios");
const SubSection = require("../models/SubSection");

async function generateTranscript(subSectionId, videoUrl) {
  try {
    // Step 1: Mark processing
    await SubSection.findByIdAndUpdate(subSectionId, {
      transcriptStatus: "processing",
      transcriptError: "",
    });

    // Step 2: Send Cloudinary video URL directly to AssemblyAI
    // const createRes = await axios.post(
    // "https://api.assemblyai.com/v2/transcript",
    // {
    //     audio_url: videoUrl,
    //     speech_model:["universal-2"]
    // },
    // {
    //     headers: {
    //     authorization: process.env.ASSEMBLYAI_API_KEY,
    //     "content-type": "application/json",
    //     },
    // }
    // );
    const createRes = await axios.post(
  "https://api.assemblyai.com/v2/transcript",
  {
    audio_url: videoUrl,
    speech_models: ["universal-2"]
  },
  {
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY,
      "content-type": "application/json"
    }
  }
);
    console.log("create ddkd",createRes)

    const transcriptId = createRes.data.id;

    // Step 3: Poll until transcription completes
    let transcriptText = "";
    let status = "queued";

    while (status !== "completed" && status !== "error") {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const pollRes = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            authorization: process.env.ASSEMBLYAI_API_KEY,
          },
        }
      );
      console.log("posssssssssssd",pollRes)

      status = pollRes.data.status;

      if (status === "completed") {
        transcriptText = pollRes.data.text;
      }

      if (status === "error") {
        throw new Error(
          pollRes.data.error || "Transcription failed"
        );
      }
    }

    // Step 4: Save transcript
    await SubSection.findByIdAndUpdate(subSectionId, {
      transcript: transcriptText,
      transcriptStatus: "completed",
      transcriptError: "",
    });

  } catch (error) {
    console.error(
      "Transcript Error:",
      error.response?.data || error.message
    );

    await SubSection.findByIdAndUpdate(subSectionId, {
      transcriptStatus: "failed",
      transcriptError:
        error.response?.data?.error || error.message,
    });
  }
}

module.exports = generateTranscript;