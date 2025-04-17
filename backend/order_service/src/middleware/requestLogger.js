const requestLogger = (req, res, next) => {
    console.log(`📢 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    next();
  };
  
  module.exports = requestLogger;
  