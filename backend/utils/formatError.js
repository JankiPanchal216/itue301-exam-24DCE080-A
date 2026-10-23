function formatValidationError(err) {
  if (!err || !err.errors) {
    return {
      error: "Validation failed",
      details: [],
    };
  }

  const details = Object.keys(err.errors).map((field) => ({
    field,
    message: err.errors[field]?.message || "Invalid value",
  }));

  return {
    error: "Validation failed",
    details,
  };
}

module.exports = { formatValidationError };
