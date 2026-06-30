const errorHandler = (err, req, res, next) => {
  let error = {
    ...err,
  };
  error.message = err.message;
  // Log the  error internally for server debugging
  console.error(`[Error Handler]: ${err.stack}`);

  //1. Mongoose Validated Error (e.g. failed schema validation )
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      error: message,
    });
  }
  //2.Mongoose Bad ObjectId Error (e.g. malformed URL params)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Resource not found with id of ${err.value}`,
    });
  }
  // 3. SyntaxError(e.g. Malformed JSON sent in requet body )
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON payload recieved",
    });
  }
  // 4. Fallback Generic System Error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
