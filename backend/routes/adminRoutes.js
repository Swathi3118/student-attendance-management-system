const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getStudents,
  createStudent,
  deleteStudent,
  markAttendance,
  getAttendanceByDate,
  getStudentReport,
} = require('../controllers/adminController');

// All admin routes are protected + admin-only
router.use(protect, adminOnly);

router.get('/stats',            getDashboardStats);
router.get('/students',         getStudents);
router.post('/students',        createStudent);
router.delete('/students/:id',  deleteStudent);
router.post('/attendance',      markAttendance);
router.get('/attendance',       getAttendanceByDate);
router.get('/attendance/:id',   getStudentReport);

module.exports = router;
