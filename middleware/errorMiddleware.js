const errorMiddleware = (err, req, res) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON payload',
    });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};

export default errorMiddleware;
