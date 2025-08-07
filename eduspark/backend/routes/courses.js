const express = require('express');
const { body } = require('express-validator');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addReview,
  getCategories
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get categories
router.get('/categories', getCategories);

// Get all courses
router.get('/', getCourses);

// Get single course
router.get('/:id', getCourse);

// Create course
router.post(
  '/',
  [
    body('title', 'Title is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('shortDescription', 'Short description is required').not().isEmpty(),
    body('category', 'Category is required').not().isEmpty(),
    body('level', 'Level is required').not().isEmpty(),
    body('price', 'Price is required').isNumeric(),
    body('thumbnail', 'Thumbnail is required').not().isEmpty()
  ],
  protect,
  authorize('instructor', 'admin'),
  createCourse
);

// Update course
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);

// Delete course
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

// Enroll in course
router.post('/:id/enroll', protect, enrollCourse);

// Add review
router.post(
  '/:id/review',
  [
    body('rating', 'Rating is required and must be between 1 and 5')
      .isInt({ min: 1, max: 5 }),
    body('comment', 'Comment is required').not().isEmpty()
  ],
  protect,
  addReview
);

module.exports = router;