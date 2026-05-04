// routes/AI.js

const express = require ('express');
const router = express.Router ();

const {
  askLectureAI,
  getLectureSummary,
  generateLectureNotes,
} = require ('../controllers/AIChat');

const {auth, isStudent} = require ('../middlewares/auth');

// =====================================
// AI Chat Routes
// =====================================

// Ask Question from Current Lecture
router.post ('/ask', auth, isStudent, askLectureAI);

// Get Lecture Summary
router.post ('/summary', auth, isStudent, getLectureSummary);

// Generate Notes
router.post ('/notes', auth, isStudent, generateLectureNotes);

module.exports = router;
