import api from "../utils/axiosInstance";
import { API_PATHS } from "../utils/aiPath";
import { executeServiceRequest } from "../utils/serviceErrorHandler";

export const uploadDocument = async ({ title, file }) =>
  executeServiceRequest(async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    const response = await api.post(API_PATHS.DOCUMENTS.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }, "Unable to upload document");

export const getDocuments = async () =>
  executeServiceRequest(async () => {
    const response = await api.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
    return response.data;
  }, "Unable to fetch documents");

export const getDocumentById = async (id) =>
  executeServiceRequest(async () => {
    const response = await api.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id));
    return response.data;
  }, "Unable to fetch document");

export const deleteDocumentById = async (id) =>
  executeServiceRequest(async () => {
    const response = await api.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id));
    return response.data;
  }, "Unable to delete document");


  export default {
    uploadDocument,
    getDocuments,
    getDocumentById,
    deleteDocumentById,
  };
