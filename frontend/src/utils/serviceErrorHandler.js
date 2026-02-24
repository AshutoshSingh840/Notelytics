export const throwServiceError = (error, fallbackMessage = "Request failed") => {
  const serviceError = error instanceof Error ? error : new Error(fallbackMessage);

  const message =
    error?.friendlyMessage ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.errors?.[0]?.msg ||
    error?.response?.data?.errors?.[0]?.message ||
    error?.message ||
    fallbackMessage;

  serviceError.message = message;
  serviceError.friendlyMessage = message;
  serviceError.status = error?.status || error?.response?.status || null;
  serviceError.details = error?.response?.data || null;

  throw serviceError;
};

export const executeServiceRequest = async (requestFn, fallbackMessage) => {
  try {
    return await requestFn();
  } catch (error) {
    throwServiceError(error, fallbackMessage);
  }
};
