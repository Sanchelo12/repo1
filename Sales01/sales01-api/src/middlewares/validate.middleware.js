export const validate = (validationFn) => (req, res, next) => {
  try {
    const result = validationFn(req.body);

    if (!result.success) {
      const errorMessages = result.error.issues
        ? result.error.issues.map((err) => ({
            field: err.path[0],
            message: err.message,
          }))
        : [];

      return res.status(400).json({
        error: errorMessages,
      });
    }

    req.body = result.data;
    next();
  } catch (error) {
    next(error);
  }
};
