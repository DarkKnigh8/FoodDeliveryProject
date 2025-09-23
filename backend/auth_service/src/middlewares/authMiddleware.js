// import jwt from 'jsonwebtoken';

// // Authentication middleware (checks for valid token)
// export const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id, email, role }
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

// // Role-based access control middleware
// export const requireRole = (role) => {
//   return (req, res, next) => {
//     if (!req.user || req.user.role !== role) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     next();
//   };
// };

// // Multi-role access (optional helper)
// export const allowRoles = (roles) => {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     next();
//   };
// };

// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

// Authentication middleware (checks for valid token)
export const authenticate = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      audience: process.env.JWT_AUDIENCE || 'your-api',
      issuer: process.env.JWT_ISSUER || 'auth-service',
    });
    req.user = decoded; // { sub, id, email, role, iss, aud, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Role-based access control middleware
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// Multi-role access (optional helper)
export const allowRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
