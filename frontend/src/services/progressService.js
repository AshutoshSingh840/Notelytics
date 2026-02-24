import api from "../utils/axiosInstance";
import { API_PATHS } from "../utils/aiPath";
import { executeServiceRequest } from "../utils/serviceErrorHandler.js";

export const getDashboardData = async () =>
  executeServiceRequest(async () => {
    const response = await api.get(API_PATHS.PROGRESS.GET_DASHBOARD);
    return response.data;
  }, "Unable to fetch dashboard progress");

  export default{
    getDashboardData
  }