const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a lesson title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide lesson description']
  },
  videoUrl: {
    type: String,
    required: [true, 'Please provide video URL']
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'link', 'document', 'image']
    }
  }],
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }],
    passingScore: {
      type: Number,
      default: 70
    }
  }
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide course title'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Please provide course description'],
    maxlength: 1000
  },
  shortDescription: {
    type: String,
    required: [true, 'Please provide short description'],
    maxlength: 200
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide course category'],
    enum: [
      'Programming',
      'Data Science',
      'Web Development',
      'Mobile Development',
      'Design',
      'Marketing',
      'Business',
      'Photography',
      'Music',
      'Health & Fitness',
      'Language',
      'Math',
      'Science',
      'Other'
    ]
  },
  level: {
    type: String,
    required: [true, 'Please provide course level'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  price: {
    type: Number,
    required: [true, 'Please provide course price'],
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  thumbnail: {
    type: String,
    required: [true, 'Please provide course thumbnail']
  },
  lessons: [LessonSchema],
  tags: [String],
  requirements: [String],
  whatYouWillLearn: [String],
  language: {
    type: String,
    default: 'English'
  },
  duration: {
    type: Number, // total duration in minutes
    default: 0
  },
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total course duration
CourseSchema.pre('save', function(next) {
  if (this.lessons && this.lessons.length > 0) {
    this.duration = this.lessons.reduce((total, lesson) => total + lesson.duration, 0);
  }
  this.updatedAt = Date.now();
  next();
});

// Update average rating
CourseSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }

  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10;
  this.rating.count = this.reviews.length;
};

module.exports = mongoose.model('Course', CourseSchema);