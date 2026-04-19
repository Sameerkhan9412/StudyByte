const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateQuizFromTranscript(transcript) {
  const prompt = `
Generate 5 multiple choice questions from this lecture transcript.

Return ONLY valid JSON array in this format:

[
 {
   "question": "",
   "options": ["", "", "", ""],
   "correctAnswer": "",
   "explanation": ""
 }
]

Transcript:
${transcript}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
  });

  const text =
    completion.choices[0].message.content;

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

module.exports = generateQuizFromTranscript;