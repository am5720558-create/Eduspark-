# EduSpark - Educational Learning Platform

EduSpark is a modern, full-featured educational platform built with React, Node.js, and MongoDB. It provides a comprehensive learning management system with course creation, student enrollment, progress tracking, and interactive features.

## 🚀 Features

### For Students
- **Course Discovery**: Browse and search through hundreds of courses
- **Interactive Learning**: Video lessons with quizzes and progress tracking
- **Personal Dashboard**: Track your learning progress and achievements
- **Course Reviews**: Rate and review courses you've completed
- **Bookmarks & Notes**: Save important moments and take notes during lessons

### For Instructors
- **Course Creation**: Easy-to-use course builder with lessons, quizzes, and resources
- **Student Analytics**: Track student progress and engagement
- **Revenue Tracking**: Monitor course sales and earnings
- **Content Management**: Upload videos, documents, and other learning materials

### For Administrators
- **User Management**: Manage students, instructors, and platform users
- **Course Moderation**: Review and approve course content
- **Analytics Dashboard**: Platform-wide statistics and insights
- **Content Control**: Manage featured courses and categories

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Morgan** for request logging

### Database
- **MongoDB** for data storage
- Comprehensive schemas for users, courses, and progress tracking
- Indexing for optimal query performance

## 📁 Project Structure

```
eduspark/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/       # Common components (Navbar, Footer)
│   │   │   ├── course/       # Course-related components
│   │   │   └── auth/         # Authentication components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store and slices
│   │   ├── services/         # API services
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── controllers/          # Route controllers
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── server.js             # Main server file
│   └── package.json
├── database/                 # Database scripts and seeders
│   └── seed.js               # Sample data seeder
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eduspark
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/eduspark
   JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

5. **Database Setup**
   
   Make sure MongoDB is running, then seed the database with sample data:
   ```bash
   cd database
   node seed.js
   ```

6. **Start the Development Servers**
   
   Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   
   In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 👥 Sample Users

After running the database seeder, you can log in with these sample accounts:

### Students
- **Email**: john@example.com | **Password**: password123
- **Email**: sarah@example.com | **Password**: password123

### Instructors
- **Email**: jane@example.com | **Password**: password123
- **Email**: mike@example.com | **Password**: password123

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Courses
- `GET /api/courses` - Get all courses (with filtering)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create new course (instructor only)
- `PUT /api/courses/:id` - Update course (instructor only)
- `DELETE /api/courses/:id` - Delete course (instructor only)
- `POST /api/courses/:id/enroll` - Enroll in course
- `POST /api/courses/:id/review` - Add course review
- `GET /api/courses/categories` - Get course categories

### Progress Tracking
- `GET /api/progress/:courseId` - Get user progress for course
- `POST /api/progress/:courseId/lesson/:lessonId` - Mark lesson complete
- `POST /api/progress/:courseId/quiz/:lessonId` - Submit quiz results

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user profile

## 🎨 UI Components

The application uses Material-UI components with a custom theme:

- **Primary Color**: Blue (#2196f3)
- **Secondary Color**: Orange (#ff9800)
- **Custom Components**: Course cards, navigation, forms, dashboards
- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern Styling**: Gradient backgrounds, shadows, and animations

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for cross-origin requests
- **Helmet Security**: Security headers and protection
- **Role-based Access**: Different permissions for students, instructors, and admins

## 📊 Database Schema

### User Model
- Personal information (name, email, avatar, bio)
- Authentication (hashed password, role)
- Course relationships (enrolled courses, created courses)
- Activity tracking (last login, registration date)

### Course Model
- Course details (title, description, category, level, price)
- Content structure (lessons with videos, quizzes, resources)
- Instructor information and student enrollments
- Rating and review system
- Publishing and featuring controls

### Progress Model
- Learning progress tracking per user per course
- Completed lessons and quiz results
- Time tracking and completion certificates
- Notes and bookmarks for lessons

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use PM2 or similar for process management
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, AWS S3)
3. Configure environment variables for API URL

### Database
- Use MongoDB Atlas for cloud hosting
- Set up proper indexing for performance
- Configure backups and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- MongoDB team for the robust database solution
- React team for the powerful frontend framework
- All contributors and beta testers

## 📞 Support

For support and questions:
- Email: support@eduspark.com
- Documentation: [docs.eduspark.com](https://docs.eduspark.com)
- Issues: [GitHub Issues](https://github.com/eduspark/eduspark/issues)

---

**EduSpark** - Empowering learners worldwide with quality online education 🎓✨