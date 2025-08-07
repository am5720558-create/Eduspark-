const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../backend/.env' });

// Import models
const User = require('../backend/models/User');
const Course = require('../backend/models/Course');
const Progress = require('../backend/models/Progress');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eduspark', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Passionate learner interested in technology and programming.',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    bio: 'Experienced software engineer and educator with 10+ years in the industry.',
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Full-stack developer and mentor, passionate about teaching modern web technologies.',
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    bio: 'Marketing professional looking to expand skills in digital marketing and design.',
  },
];

const sampleCourses = [
  {
    title: 'Complete JavaScript Course 2024',
    description: 'Master JavaScript from beginner to advanced level. Learn ES6+, DOM manipulation, async programming, and modern frameworks.',
    shortDescription: 'Complete JavaScript course covering fundamentals to advanced concepts.',
    category: 'Programming',
    level: 'Beginner',
    price: 89.99,
    discountPrice: 49.99,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop',
    tags: ['JavaScript', 'Web Development', 'Programming', 'ES6'],
    requirements: ['Basic computer skills', 'No prior programming experience needed'],
    whatYouWillLearn: [
      'Master JavaScript fundamentals',
      'Build interactive web applications',
      'Understand modern ES6+ features',
      'Work with APIs and async programming'
    ],
    language: 'English',
    isPublished: true,
    isFeatured: true,
    lessons: [
      {
        title: 'Introduction to JavaScript',
        description: 'Learn what JavaScript is and how it works',
        videoUrl: 'https://example.com/video1',
        duration: 45,
        order: 1,
        resources: [
          { title: 'Course Notes', url: 'https://example.com/notes1', type: 'pdf' }
        ]
      },
      {
        title: 'Variables and Data Types',
        description: 'Understanding JavaScript variables and data types',
        videoUrl: 'https://example.com/video2',
        duration: 60,
        order: 2,
        quiz: {
          questions: [
            {
              question: 'What is the correct way to declare a variable in JavaScript?',
              options: ['var x = 5', 'variable x = 5', 'v x = 5', 'declare x = 5'],
              correctAnswer: 0,
              explanation: 'var, let, or const are used to declare variables in JavaScript'
            }
          ],
          passingScore: 70
        }
      }
    ]
  },
  {
    title: 'React Development Masterclass',
    description: 'Build modern web applications with React. Learn hooks, state management, routing, and best practices.',
    shortDescription: 'Comprehensive React course for building modern web apps.',
    category: 'Web Development',
    level: 'Intermediate',
    price: 129.99,
    discountPrice: 79.99,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
    tags: ['React', 'JavaScript', 'Web Development', 'Frontend'],
    requirements: ['JavaScript fundamentals', 'HTML/CSS knowledge'],
    whatYouWillLearn: [
      'Build React applications from scratch',
      'Master React hooks and state management',
      'Implement routing and navigation',
      'Deploy React applications'
    ],
    language: 'English',
    isPublished: true,
    isFeatured: true,
    lessons: [
      {
        title: 'Getting Started with React',
        description: 'Introduction to React and component-based architecture',
        videoUrl: 'https://example.com/react1',
        duration: 55,
        order: 1
      }
    ]
  },
  {
    title: 'Python for Data Science',
    description: 'Learn Python programming for data analysis, visualization, and machine learning.',
    shortDescription: 'Python programming course focused on data science applications.',
    category: 'Data Science',
    level: 'Beginner',
    price: 99.99,
    thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=200&fit=crop',
    tags: ['Python', 'Data Science', 'Machine Learning', 'Analytics'],
    requirements: ['Basic math skills', 'No programming experience needed'],
    whatYouWillLearn: [
      'Python programming fundamentals',
      'Data manipulation with pandas',
      'Data visualization with matplotlib',
      'Introduction to machine learning'
    ],
    language: 'English',
    isPublished: true,
    isFeatured: true,
    lessons: [
      {
        title: 'Python Basics',
        description: 'Introduction to Python syntax and basic concepts',
        videoUrl: 'https://example.com/python1',
        duration: 40,
        order: 1
      }
    ]
  },
  {
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design.',
    shortDescription: 'Complete guide to UI/UX design principles and tools.',
    category: 'Design',
    level: 'Beginner',
    price: 79.99,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
    tags: ['UI Design', 'UX Design', 'Figma', 'Design Thinking'],
    requirements: ['No design experience needed'],
    whatYouWillLearn: [
      'Design thinking methodology',
      'User research techniques',
      'Wireframing and prototyping',
      'Visual design principles'
    ],
    language: 'English',
    isPublished: true,
    isFeatured: false,
    lessons: [
      {
        title: 'Introduction to Design Thinking',
        description: 'Understanding the design thinking process',
        videoUrl: 'https://example.com/design1',
        duration: 35,
        order: 1
      }
    ]
  },
  {
    title: 'Digital Marketing Strategy',
    description: 'Master digital marketing strategies including SEO, social media, and content marketing.',
    shortDescription: 'Comprehensive digital marketing course for modern businesses.',
    category: 'Marketing',
    level: 'Intermediate',
    price: 89.99,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
    tags: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing'],
    requirements: ['Basic business knowledge'],
    whatYouWillLearn: [
      'Digital marketing strategy development',
      'Search engine optimization',
      'Social media marketing',
      'Content marketing best practices'
    ],
    language: 'English',
    isPublished: true,
    isFeatured: true,
    lessons: [
      {
        title: 'Digital Marketing Overview',
        description: 'Introduction to digital marketing landscape',
        videoUrl: 'https://example.com/marketing1',
        duration: 30,
        order: 1
      }
    ]
  },
  {
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
    shortDescription: 'Complete Node.js course for backend development.',
    category: 'Web Development',
    level: 'Intermediate',
    price: 109.99,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
    tags: ['Node.js', 'Express', 'MongoDB', 'Backend'],
    requirements: ['JavaScript knowledge', 'Basic web development experience'],
    whatYouWillLearn: [
      'Node.js fundamentals',
      'Express.js framework',
      'Database integration',
      'API development'
    ],
    language: 'English',
    isPublished: true,
    isFeatured: true,
    lessons: [
      {
        title: 'Node.js Introduction',
        description: 'Getting started with Node.js runtime',
        videoUrl: 'https://example.com/node1',
        duration: 50,
        order: 1
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Progress.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }

    console.log('Created sample users');

    // Create courses with instructors
    const instructors = createdUsers.filter(user => user.role === 'instructor');
    
    for (let i = 0; i < sampleCourses.length; i++) {
      const courseData = sampleCourses[i];
      const instructor = instructors[i % instructors.length];
      
      const course = new Course({
        ...courseData,
        instructor: instructor._id
      });

      const savedCourse = await course.save();

      // Add course to instructor's created courses
      instructor.createdCourses.push(savedCourse._id);
      await instructor.save();

      // Add some sample ratings
      const ratingCount = Math.floor(Math.random() * 50) + 10;
      const averageRating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
      
      savedCourse.rating.average = parseFloat(averageRating);
      savedCourse.rating.count = ratingCount;
      await savedCourse.save();
    }

    console.log('Created sample courses');

    // Enroll some students in courses
    const students = createdUsers.filter(user => user.role === 'student');
    const courses = await Course.find();

    for (const student of students) {
      // Enroll in 2-3 random courses
      const numEnrollments = Math.floor(Math.random() * 2) + 2;
      const shuffledCourses = courses.sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < numEnrollments && i < shuffledCourses.length; i++) {
        const course = shuffledCourses[i];
        
        // Add enrollment to course
        course.enrolledStudents.push({
          student: student._id,
          enrolledAt: new Date()
        });
        await course.save();

        // Add enrollment to student
        student.enrolledCourses.push({
          course: course._id,
          enrolledAt: new Date(),
          progress: Math.floor(Math.random() * 100)
        });
        await student.save();

        // Create progress tracking
        const progress = new Progress({
          user: student._id,
          course: course._id,
          overallProgress: Math.floor(Math.random() * 100),
          totalTimeSpent: Math.floor(Math.random() * 300) + 60,
          completedLessons: course.lessons.slice(0, Math.floor(Math.random() * course.lessons.length)).map(lesson => ({
            lesson: lesson._id,
            completedAt: new Date(),
            timeSpent: Math.floor(Math.random() * 60) + 15
          }))
        });
        await progress.save();
      }
    }

    console.log('Created sample enrollments and progress');
    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
connectDB().then(() => {
  seedDatabase();
});

module.exports = { seedDatabase };