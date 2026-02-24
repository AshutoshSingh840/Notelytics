import api from "../utils/axiosInstance";
import { API_PATHS } from "../utils/aiPath";
import { executeServiceRequest } from "../utils/serviceErrorHandler";

export const getQuizzesByDocumentId = async (documentId) =>
  executeServiceRequest(async () => {
    const response = await api.get(API_PATHS.QUIZZES.GET_BY_DOCUMENT_ID(documentId));
    return response.data;
  }, "Unable to fetch quizzes");

export const getQuizById = async (quizId) =>
  executeServiceRequest(async () => {
    const response = await api.get(API_PATHS.QUIZZES.GET_BY_ID(quizId));
    return response.data;
  }, "Unable to fetch quiz");

export const submitQuizAnswers = async (quizId, answers) =>
  executeServiceRequest(async () => {
    const response = await api.post(API_PATHS.QUIZZES.SUBMIT(quizId), { answers });
    return response.data;
  }, "Unable to submit quiz answers");

export const getQuizResults = async (quizId) =>
  executeServiceRequest(async () => {
    const response = await api.get(API_PATHS.QUIZZES.GET_RESULTS(quizId));
    return response.data;
  }, "Unable to fetch quiz results");

export const deleteQuizById = async (quizId) =>
  executeServiceRequest(async () => {
    const response = await api.delete(API_PATHS.QUIZZES.DELETE(quizId));
    return response.data;
  }, "Unable to delete quiz");
