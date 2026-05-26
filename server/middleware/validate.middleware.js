function validate(schema, source = "body") {
  return function validateRequest(req, res, next) {
    if (typeof schema === "function") {
      const result = schema(req[source], req);

      if (result?.error) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          details: result.error,
        });
      }

      if (result?.value) {
        req[source] = result.value;
      }

      return next();
    }

    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: result.error.flatten(),
      });
    }

    req[source] = result.data;
    return next();
  };
}

module.exports = validate;
