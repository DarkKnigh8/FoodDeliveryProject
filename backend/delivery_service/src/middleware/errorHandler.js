const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message); // Log message
  console.error('Stack:', err.stack);   // Log full stack
  res.status(500).json({ message: 'Server error: ' + err.message });
};

export default errorHandler;
