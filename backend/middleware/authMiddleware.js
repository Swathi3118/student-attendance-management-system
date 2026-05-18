// ─────────────────────────────────────────────
//  Auth Middleware
//  protect     — verifies JWT, attaches req.user
//  adminOnly   — restricts to admin role
//  studentOnly — restricts to student role
// ─────────────────────────────────────────────
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

/** Verify Bearer token and attach decoded user to req.user */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Student.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized — token invalid or expired' });
  }
};

/** Allow only admin role */
const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Access denied: Admins only' });
};

/** Allow only student role */
const studentOnly = (req, res, next) => {
  if (req.user?.role === 'student') return next();
  res.status(403).json({ message: 'Access denied: Students only' });
};

module.exports = { protect, adminOnly, studentOnly };
