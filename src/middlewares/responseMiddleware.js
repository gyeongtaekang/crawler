const responseMiddleware = (req, res, next) => {
  console.log("[RESPONSE MIDDLEWARE] Middleware initialized");

  res.success = (data, pagination) => {
    console.log("[RESPONSE MIDDLEWARE] res.success called");
    console.log("[RESPONSE MIDDLEWARE] Response data:", data);
    if (pagination) {
      console.log("[RESPONSE MIDDLEWARE] Pagination info:", pagination);
    }
    res.status(200).json({
      status: 'success',
      data,
      pagination,
    });
    console.log("[RESPONSE MIDDLEWARE] Success response sent");
  };

  res.error = (message, code = 'UNKNOWN_ERROR', statusCode = 500) => {
    console.log("[RESPONSE MIDDLEWARE] res.error called");
    console.log("[RESPONSE MIDDLEWARE] Error message:", message);
    console.log("[RESPONSE MIDDLEWARE] Error code:", code);
    console.log("[RESPONSE MIDDLEWARE] HTTP status code:", statusCode);
    res.status(statusCode).json({
      status: 'error',
      message,
      code,
    });
    console.log("[RESPONSE MIDDLEWARE] Error response sent");
  };

  console.log("[RESPONSE MIDDLEWARE] Passing control to next middleware");
  next();
};

module.exports = responseMiddleware;
