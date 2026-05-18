// ─────────────────────────────────────────────
//  Auth Controller
//  POST /api/auth/login
//  GET  /api/auth/me
// ─────────────────────────────────────────────
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

/** Generate a signed JWT valid for 7 days */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @desc   Login (admin or student)
// @route  POST /api/auth/login
// @access Public
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Please provide email and password' });

  try {
    const user = await Student.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        _id:     user._id,
        name:    user.name,
        email:   user.email,
        rollNum: user.rollNum,
        role:    user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get current logged-in user
// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json({
    _id:     req.user._id,
    name:    req.user.name,
    email:   req.user.email,
    rollNum: req.user.rollNum,
    role:    req.user.role,
  });
};

module.exports = { login, getMe };
