// ─────────────────────────────────────────────
//  Admin Controller
//  Handles student CRUD, attendance marking, reports
// ─────────────────────────────────────────────
const Student    = require('../models/Student');
const Attendance = require('../models/Attendance');

// ── Helpers ──────────────────────────────────
/** Returns midnight UTC for a given date string */
const toUTCMidnight = (dateStr) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// ── Dashboard Stats ───────────────────────────
// @route GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents  = await Student.countDocuments({ role: 'student' });
    const today          = toUTCMidnight();
    const todayRecords   = await Attendance.find({ date: today });
    const presentToday   = todayRecords.filter(r => r.status === 'Present').length;
    const absentToday    = todayRecords.filter(r => r.status === 'Absent').length;

    res.json({ totalStudents, presentToday, absentToday, markedToday: todayRecords.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Students ──────────────────────────────────
// @route GET /api/admin/students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ role: 'student' })
      .select('-password')
      .sort({ rollNum: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/admin/students
const createStudent = async (req, res) => {
  const { name, email, rollNum, password } = req.body;
  if (!name || !email || !rollNum || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const exists = await Student.findOne({ $or: [{ email: email.toLowerCase() }, { rollNum }] });
    if (exists)
      return res.status(400).json({ message: 'Email or roll number already exists' });

    const student = await Student.create({ name, email, rollNum, password, role: 'student' });
    res.status(201).json({
      _id:     student._id,
      name:    student.name,
      email:   student.email,
      rollNum: student.rollNum,
      role:    student.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/admin/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student || student.role !== 'student')
      return res.status(404).json({ message: 'Student not found' });

    await Student.findByIdAndDelete(req.params.id);
    await Attendance.deleteMany({ studentId: req.params.id });
    res.json({ message: 'Student and their attendance records deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Attendance ────────────────────────────────
// @route POST /api/admin/attendance
// Body: { date: "YYYY-MM-DD", attendanceList: [{ studentId, status }] }
const markAttendance = async (req, res) => {
  const { date, attendanceList } = req.body;
  if (!date || !attendanceList?.length)
    return res.status(400).json({ message: 'date and attendanceList are required' });

  try {
    const attendanceDate = toUTCMidnight(date);

    // Upsert each record (create or update if already marked)
    const ops = attendanceList.map(({ studentId, status }) => ({
      updateOne: {
        filter: { studentId, date: attendanceDate },
        update: { $set: { status } },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);
    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/admin/attendance?date=YYYY-MM-DD
const getAttendanceByDate = async (req, res) => {
  try {
    const date = toUTCMidnight(req.query.date);
    const records = await Attendance.find({ date }).populate('studentId', 'name rollNum email');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/admin/attendance/:id  (individual student report)
const getStudentReport = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const records    = await Attendance.find({ studentId: req.params.id }).sort({ date: -1 });
    const total      = records.length;
    const present    = records.filter(r => r.status === 'Present').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.json({ student, records, stats: { total, present, absent: total - present, percentage } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDashboardStats,
  getStudents,
  createStudent,
  deleteStudent,
  markAttendance,
  getAttendanceByDate,
  getStudentReport,
};
