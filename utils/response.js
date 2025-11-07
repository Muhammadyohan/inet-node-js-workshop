// utils/response.js

// Utility functions for sending standardized API responses
// including success, error, and internal server error responses.

/** Send Internal Server Error response */
const sendInternalServerError = (res, error = null) => {
  if (error) {
    console.error(error);
  }

  res.status(500).send({
    status: 500,
    message: "Internal Server Error",
    data: error
      ? {
          error: error.message || "An unexpected error occurred on the server",
        }
      : null,
  });
};

/** Send Success response (For 2XX status codes) */
const sendSuccess = (res, statusCode, message, data = []) => {
  res.status(statusCode).send({
    status: statusCode,
    message: message,
    data: data,
  });
};

/** Send Error response (For 4XX status codes) */
const sendError = (res, statusCode, message, data = null) => {
  res.status(statusCode).send({
    status: statusCode,
    message: message,
    data: data,
  });
};

module.exports = {
  sendInternalServerError,
  sendSuccess,
  sendError,
};
