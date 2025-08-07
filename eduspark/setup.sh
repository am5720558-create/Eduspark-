#!/bin/bash

echo "🚀 Setting up EduSpark Educational Platform..."
echo "==============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: brew services start mongodb/brew/mongodb-community"
    echo "   Or: sudo systemctl start mongod"
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "📦 Installing database dependencies..."
cd ../database
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install database dependencies"
    exit 1
fi

echo "🗃️  Setting up database with sample data..."
node seed.js
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🎉 EduSpark is ready to go!"
echo ""
echo "To start the application:"
echo "1. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "3. Open your browser and go to:"
echo "   http://localhost:3000"
echo ""
echo "📚 Sample login credentials:"
echo "   Student: john@example.com / password123"
echo "   Instructor: jane@example.com / password123"
echo ""
echo "Happy learning! 🎓✨"