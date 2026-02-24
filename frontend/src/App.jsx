import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/auth-context.js";
import ProtectedRoute from "./component/auth/ProtectedRoute";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Dashboard
import DashboardPage from "./pages/dashboard/Dashboard";

// Documents
import DocumentListPage from "./pages/documents/DocumentListPage";
import DocumentDetailPage from "./pages/documents/DocumentDetailPage";

// Flashcards
import FlashcardsListPage from "./pages/flashcard/FlashCardListPage";
import FlashcardPage from "./pages/flashcard/FlashCardPage";

// Profile
import ProfilePage from "./pages/profile/ProfilePage";
import QuizResultsPage from "./pages/quizzes/QuizResultsPage";
import QuizAttemptPage from "./pages/quizzes/QuizAttemptPage";

// (If you create NotFoundPage, adjust path)
// import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>

        {/* Root */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
          <Route path="/quizzes/:quizId/attempt" element={<QuizAttemptPage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* <Route path="*" element={<NotFoundPage />} /> */}

      </Routes>
    </Router>
  );
};

export default App;
