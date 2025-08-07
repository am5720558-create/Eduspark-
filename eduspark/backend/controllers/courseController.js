const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const {
      category,
      level,
      search,
      sort,
      page = 1,
      limit = 12,
      featured
    } = req.query;

    // Build query
    let query = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (featured) {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sorting
    let sortBy = {};
    if (sort) {
      switch (sort) {
        case 'newest':
          sortBy = { createdAt: -1 };
          break;
        case 'oldest':
          sortBy = { createdAt: 1 };
          break;
        case 'rating':
          sortBy = { 'rating.average': -1 };
          break;
        case 'price-low':
          sortBy = { price: 1 };
          break;
        case 'price-high':
          sortBy = { price: -1 };
          break;
        default:
          sortBy = { createdAt: -1 };
      }
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-lessons');

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      count: courses.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: courses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate('reviews.user', 'name avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
const createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.id
    };

    const course = await Course.create(courseData);

    // Add course to user's created courses
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { createdCourses: course._id } }
    );

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Course Owner/Admin)
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Course Owner/Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    // Remove course from user's created courses
    await User.findByIdAndUpdate(
      course.instructor,
      { $pull: { createdCourses: course._id } }
    );

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const user = await User.findById(req.user.id);
    const isEnrolled = user.enrolledCourses.some(
      (enrollment) => enrollment.course.toString() === req.params.id
    );

    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add student to course
    course.enrolledStudents.push({
      student: req.user.id,
      enrolledAt: new Date()
    });
    await course.save();

    // Add course to user's enrolled courses
    user.enrolledCourses.push({
      course: req.params.id,
      enrolledAt: new Date(),
      progress: 0
    });
    await user.save();

    // Create progress tracking
    await Progress.create({
      user: req.user.id,
      course: req.params.id
    });

    res.json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add review to course
// @route   POST /api/courses/:id/review
// @access  Private
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled
    const user = await User.findById(req.user.id);
    const isEnrolled = user.enrolledCourses.some(
      (enrollment) => enrollment.course.toString() === req.params.id
    );

    if (!isEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Must be enrolled to review this course'
      });
    }

    // Check if already reviewed
    const existingReview = course.reviews.find(
      (review) => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Course already reviewed'
      });
    }

    // Add review
    course.reviews.push({
      user: req.user.id,
      rating,
      comment
    });

    // Update average rating
    course.calculateAverageRating();
    await course.save();

    res.json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get course categories
// @route   GET /api/courses/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Course.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addReview,
  getCategories
};