const axios = require("axios");

async function generateTranscript(videoUrl) {
  try {
    // Create transcript request
    const createRes = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: videoUrl,
        speech_models: ["universal-2"],
      },
      {
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    const transcriptId = createRes.data.id;

    let status = "queued";
    let transcriptText = "";

    // Poll until completed or error
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

      status = pollRes.data.status;

      if (status === "completed") {
        transcriptText = pollRes.data.text;
      }

      if (status === "error") {
        return {
          success: false,
          transcript: "",
          transcriptStatus: "failed",
          transcriptError:
            pollRes.data.error || "Transcription failed",
        };
      }
    }

    return {
      success: true,
      transcript: transcriptText,
      transcriptStatus: "completed",
      transcriptError: "",
    };

  } catch (error) {
    console.error(
      "Transcript Error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      transcript: "",
      transcriptStatus: "failed",
      transcriptError:
        error.response?.data?.error || error.message,
    };
  }
}

module.exports = generateTranscript;