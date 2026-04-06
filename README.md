# Notelytics

An intelligent study platform powered by AI that helps users create, manage, and master study materials through documents, flashcards, quizzes, and personalized learning activities.

## 🌟 Features

### Core Functionality
- **Document Management**: Upload and organize PDF documents
- **Flashcard System**: Generate and manage custom flashcard sets
- **Quiz Generation**: AI-powered quiz creation from study materials
- **Study Tracking**: Track progress and study activities
- **AI Chat Assistant**: Ask questions about your study materials
- **User Authentication**: Secure login and registration with JWT
- **Progress Analytics**: Monitor learning progress and mastery levels

### Technical Highlights
- **AI Integration**: Google Generative AI (Gemini) for intelligent content generation
- **PDF Processing**: Parse and extract text from PDF documents
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Real-time Feedback**: Toast notifications for user actions
- **RESTful API**: Well-structured backend with Express.js
- **Database**: MongoDB for persistent data storage

## 📋 Project Structure

```
Notelytics/
├── backend/                 # Node.js/Express server
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth & error handling
│   ├── config/            # Database & Multer config
│   ├── utils/             # Helper functions (AI, PDF parsing, etc.)
│   ├── uploads/           # File storage directory
│   └── server.js          # Entry point
└── frontend/              # React + Vite application
    ├── src/
    │   ├── pages/         # Page components
    │   ├── components/    # Reusable UI components
    │   ├── services/      # API service layer
    │   ├── context/       # React context (Auth)
    │   └── utils/         # Helper utilities
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Google AI API Key** (for Gemini integration)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/notelytics
# or for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notelytics

# Google AI
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server
PORT=5000
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is in use)

## 📚 API Documentation

The backend provides REST API endpoints organized by feature:

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout

### Documents Routes (`/api/documents`)
- `GET /` - Get all documents for the user
- `POST /` - Upload a new document
- `GET /:id` - Get document details
- `DELETE /:id` - Delete a document

### Flashcards Routes (`/api/flashcards`)
- `GET /` - Get all flashcard sets
- `POST /` - Create a new flashcard set
- `GET /:id` - Get flashcard set details
- `PUT /:id` - Update a flashcard set
- `DELETE /:id` - Delete a flashcard set

### Quizzes Routes (`/api/quizzes`)
- `GET /` - Get all quizzes
- `POST /` - Generate a new quiz
- `POST /:id/attempt` - Submit quiz attempt
- `DELETE /:id` - Delete a quiz

### AI Routes (`/api/ai`)
- `POST /chat` - Chat with AI assistant
- `POST /generate-flashcards` - Generate flashcards from content
- `POST /generate-quiz` - Generate quiz from content

### Progress Routes (`/api/progress`)
- `GET /stats` - Get user progress statistics
- `GET /activity` - Get study activity history

## 🔧 Backend Technologies

- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database and ODM
- **Google Generative AI** - AI integration
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **Swagger/OpenAPI** - API documentation

## ⚛️ Frontend Technologies

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

## 📖 Usage

### Register & Login
1. Visit the application homepage
2. Click "Register" to create a new account
3. Log in with your credentials

### Upload Documents
1. Go to the Documents section
2. Click "Upload Document"
3. Select a PDF file
4. The system will parse and store the content

### Generate Flashcards
1. Select a document or enter custom content
2. Click "Generate Flashcards"
3. AI will create a set of flashcards from the material
4. Review and edit flashcards as needed

### Create Quizzes
1. Choose a document or flashcard set
2. Click "Generate Quiz"
3. Specify number of questions
4. Take the quiz and view results

### Use AI Chat
1. Open the Chat Assistant
2. Ask questions about your study materials
3. Get AI-powered responses and explanations

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes and middleware
- CORS configuration
- Error handling middleware
- Input validation with express-validator

## 🛣️ Roadmap

- [ ] Spaced repetition algorithm
- [ ] Collaborative study groups
- [ ] Progress export/reports
- [ ] Mobile app
- [ ] Voice note support
- [ ] Study reminders
- [ ] Performance analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please create an issue in the repository or contact the development team.

## 👨‍💻 Author

Created with ❤️ by the Notelytics team

---

**Last Updated**: April 2026