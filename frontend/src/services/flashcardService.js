import api from "../utils/axiosInstance";
import { API_PATHS } from "../utils/aiPath";
import { executeServiceRequest } from "../utils/serviceErrorHandler";

export const getAllFlashcardSets = async () =>
  executeServiceRequest(async () => {
    const response = await api.get(API_PATHS.FLASHCARDS.GET_ALL);
    return response.data;
  }, "Unable to fetch flashcards");

export const getDueFlashcards = async () =>
  executeServiceRequest(async () => {
    const response = await api.get(API_PATHS.FLASHCARDS.GET_DUE);
    return response.data;
  }, "Unable to fetch due flashcards");

export const getFlashcardsByDocumentId = async (documentId) =>
  executeServiceRequest(async () => {
    const response = await api.get(API_PATHS.FLASHCARDS.GET_BY_DOCUMENT_ID(documentId));
    return response.data;
  }, "Unable to fetch document flashcards");

export const reviewFlashcardById = async (cardId, payload = {}) =>
  executeServiceRequest(async () => {
    const response = await api.post(API_PATHS.FLASHCARDS.REVIEW(cardId), payload);
    return response.data;
  }, "Unable to review flashcard");

export const toggleFlashcardStarById = async (cardId) =>
  executeServiceRequest(async () => {
    const response = await api.put(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
    return response.data;
  }, "Unable to update flashcard star");

export const deleteFlashcardSetById = async (id) =>
  executeServiceRequest(async () => {
    const response = await api.delete(API_PATHS.FLASHCARDS.DELETE(id));
    return response.data;
  }, "Unable to delete flashcard set");

export default {
  getAllFlashcardSets,
  getDueFlashcards,
  getFlashcardsByDocumentId,
  reviewFlashcardById,
  toggleFlashcardStarById,
  deleteFlashcardSetById,
};
