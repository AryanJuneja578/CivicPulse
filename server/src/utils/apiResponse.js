/**
 * Standardized API response helpers for CivicPulse
 */

const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const payload = {
    success: true,
    message
  };

  if (data !== null) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

const errorResponse = (res, statusCode = 400, message = 'An error occurred', errors = null) => {
  const payload = {
    success: false,
    message
  };

  if (errors !== null) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse,
  errorResponse
};
