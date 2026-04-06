export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },

  DOCUMENTS: {
    UPLOAD: "/api/documents/upload",
    GET_DOCUMENTS: "/api/documents",
    GET_DOCUMENT_BY_ID: (id) => `/api/documents/${id}`,
    UPDATE_DOCUMENT: (id) => `/api/documents/${id}`,
    DELETE_DOCUMENT: (id) => `/api/documents/${id}`,
  },

  AI: {
    GENERATE_FLASHCARDS: "/api/ai/generate-flashcards",
    GENERATE_QUIZ: "/api/ai/generate-quiz",
    GENERATE_SUMMARY: "/api/ai/generate-summary",
    CHAT: "/api/ai/chat",
    EXPLAIN_CONCEPT: "/api/ai/explain-concept",
    GET_CHAT_HISTORY: (documentId) => `/api/ai/chat-history/${documentId}`,
  },

  QUIZZES: {
    GET_BY_DOCUMENT_ID: (documentId) => `/api/quizzes/${documentId}`,
    GET_BY_ID: (quizId) => `/api/quizzes/quiz/${quizId}`,
    SUBMIT: (quizId) => `/api/quizzes/${quizId}/submit`,
    GET_RESULTS: (quizId) => `/api/quizzes/${quizId}/results`,
    DELETE: (quizId) => `/api/quizzes/${quizId}`,
  },

  PROGRESS: {
    GET_DASHBOARD: "/api/progress/dashboard",
  },

  FLASHCARDS: {
    GET_ALL: "/api/flashcards",
    GET_DUE: "/api/flashcards/due",
    GET_BY_DOCUMENT_ID: (documentId) => `/api/flashcards/${documentId}`,
    REVIEW: (cardId) => `/api/flashcards/${cardId}/review`,
    TOGGLE_STAR: (cardId) => `/api/flashcards/${cardId}/star`,
    DELETE: (id) => `/api/flashcards/${id}`,
  },
};
