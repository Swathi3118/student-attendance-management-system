// ─────────────────────────────────────────────
//  Student Controller
//  Handles a student viewing their own data
// ─────────────────────────────────────────────
const Attendance = require('../models/Attendance');

// @desc   Get own attendance records
// @route  GET /api/student/attendance
// @access Private (student)
const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get own attendance stats (total / present / absent / %)
// @route  GET /api/student/stats
// @access Private (student)
const getMyStats = async (req, res) => {
  try {
    const records    = await Attendance.find({ studentId: req.user._id });
    const total      = records.length;
    const present    = records.filter(r => r.status === 'Present').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.json({ total, present, absent: total - present, percentage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyAttendance, getMyStats };
