export const successResponse = (error, status, message, result) => ({ error, status, message, result });

export const serverErrorResponse = (status, message) => ({ error: true, status, message });
