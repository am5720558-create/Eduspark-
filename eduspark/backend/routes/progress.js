const express = require('express');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
router.get('/:courseId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId
    }).populate('course', 'title lessons');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark lesson as completed
// @route   POST /api/progress/:courseId/lesson/:lessonId
// @access  Private
router.post('/:courseId/lesson/:lessonId', protect, async (req, res) => {
  try {
    const { timeSpent } = req.body;

    let progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    // Check if lesson already completed
    const existingCompletion = progress.completedLessons.find(
      lesson => lesson.lesson.toString() === req.params.lessonId
    );

    if (!existingCompletion) {
      progress.completedLessons.push({
        lesson: req.params.lessonId,
        timeSpent: timeSpent || 0
      });

      await progress.calculateProgress();
      progress.calculateTotalTime();
      progress.lastAccessedAt = new Date();
      
      await progress.save();
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Submit quiz result
// @route   POST /api/progress/:courseId/quiz/:lessonId
// @access  Private
router.post('/:courseId/quiz/:lessonId', protect, async (req, res) => {
  try {
    const { score, answers } = req.body;

    let progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    // Find existing quiz result
    const existingQuizIndex = progress.quizResults.findIndex(
      quiz => quiz.lesson.toString() === req.params.lessonId
    );

    if (existingQuizIndex !== -1) {
      // Update existing quiz result
      progress.quizResults[existingQuizIndex].score = score;
      progress.quizResults[existingQuizIndex].answers = answers;
      progress.quizResults[existingQuizIndex].attempts += 1;
      progress.quizResults[existingQuizIndex].completedAt = new Date();
    } else {
      // Add new quiz result
      progress.quizResults.push({
        lesson: req.params.lessonId,
        score,
        answers,
        attempts: 1
      });
    }

    progress.lastAccessedAt = new Date();
    await progress.save();

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;