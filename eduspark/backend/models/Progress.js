const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    timeSpent: {
      type: Number, // in minutes
      default: 0
    }
  }],
  quizResults: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    answers: [{
      question: Number,
      selectedAnswer: Number,
      isCorrect: Boolean
    }],
    attempts: {
      type: Number,
      default: 1
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: Date,
    certificateId: String
  },
  notes: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    content: String,
    timestamp: Number, // video timestamp in seconds
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookmarks: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    timestamp: Number, // video timestamp in seconds
    title: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update progress percentage
ProgressSchema.methods.calculateProgress = async function() {
  const course = await mongoose.model('Course').findById(this.course);
  if (!course || !course.lessons || course.lessons.length === 0) {
    this.overallProgress = 0;
    return;
  }

  const totalLessons = course.lessons.length;
  const completedLessons = this.completedLessons.length;
  
  this.overallProgress = Math.round((completedLessons / totalLessons) * 100);
  
  // Check if course is completed
  if (this.overallProgress === 100 && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  
  this.updatedAt = new Date();
};

// Calculate total time spent
ProgressSchema.methods.calculateTotalTime = function() {
  this.totalTimeSpent = this.completedLessons.reduce((total, lesson) => {
    return total + (lesson.timeSpent || 0);
  }, 0);
};

// Pre-save middleware
ProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound index for efficient queries
ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);