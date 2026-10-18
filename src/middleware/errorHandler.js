/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  // Format errors array or object
  let errors = {};
  if (err.errors) {
    if (Array.isArray(err.errors)) {
      errors = { body: err.errors };
    } else {
      errors = err.errors;
    }
  } else if (err.message) {
    errors = { message: err.message };
  } else {
    errors = { message: 'Internal Server Error' };
  }

  res.status(status).json({ errors });
}

module.exports = errorHandler;
