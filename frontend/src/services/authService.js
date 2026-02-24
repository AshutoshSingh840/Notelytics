import api from "../utils/axiosInstance";
import { API_PATHS } from "../utils/aiPath";
import { executeServiceRequest } from "../utils/serviceErrorHandler";

export const registerUser = async (payload) =>
  executeServiceRequest(async () => {
    const response = await api.post(API_PATHS.AUTH.REGISTER, payload);
    return response.data;
  }, "Unable to register user");

export const loginUser = async (payload) =>
  executeServiceRequest(async () => {
    const response = await api.post(API_PATHS.AUTH.LOGIN, payload);
    return response.data;
  }, "Unable to log in");

export const getUserProfile = async () =>
  executeServiceRequest(async () => {
    const response = await api.get(API_PATHS.AUTH.GET_PROFILE);
    return response.data;
  }, "Unable to fetch profile");

export const updateUserProfile = async (payload) =>
  executeServiceRequest(async () => {
    const response = await api.put(API_PATHS.AUTH.UPDATE_PROFILE, payload);
    return response.data;
  }, "Unable to update profile");

export const changeUserPassword = async (payload) =>
  executeServiceRequest(async () => {
    const response = await api.post(API_PATHS.AUTH.CHANGE_PASSWORD, payload);
    return response.data;
  }, "Unable to change password");



  export default {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changeUserPassword
  }