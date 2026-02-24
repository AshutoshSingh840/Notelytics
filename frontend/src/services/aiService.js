import api from "../utils/axiosInstance";
import { API_PATHS } from "../utils/aiPath";
import { executeServiceRequest } from "../utils/serviceErrorHandler";

export const generateFlashcards = async (payload) =>
  executeServiceRequest(async () => {
    const response = await api.post(API_PATHS.AI.GENERATE_FLASHCARDS, payload);
    return response.data;
  }, "Unable to generate flashcards");

export const generateQuiz = async (payload) =>
  executeServiceRequest(async () => {
    const response = await api.post(API_PATHS.AI.GENERATE_QUIZ, payload);
    return response.data;
  }, "Unable to generate quiz");

export const generateSummary = async (payload) =>
  executeServiceRequest(async () => {
    const response = await api.post(API_PATHS.AI.GENERATE_SUMMARY, payload);
    return response.data;
  }, "Unable to generate summary");

export const chatWithDocument = async (payload) =>
  executeServiceRequest(async () => {
    const response = await api.post(API_PATHS.AI.CHAT, payload);
    return response.data;
  }, "Unable to send chat message");

export const explainDocumentConcept = async (payload) =>
  executeServiceRequest(async () => {
    const response = await api.post(API_PATHS.AI.EXPLAIN_CONCEPT, payload);
    return response.data;
  }, "Unable to explain concept");

export const getDocumentChatHistory = async (documentId) =>
  executeServiceRequest(async () => {
    const response = await api.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
    return response.data;
  }, "Unable to fetch chat history");

export default {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat: chatWithDocument,
  explainConcept: explainDocumentConcept,
  getChatHistory: getDocumentChatHistory,
};
