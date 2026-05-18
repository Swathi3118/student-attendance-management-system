// ─────────────────────────────────────────────
//  Seed Script
//  Creates 1 admin + 5 students + 10 days of attendance
//
//  Run: npm run seed
// ─────────────────────────────────────────────
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const Student  = require('./models/Student');
const Attendance = require('./models/Attendance');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected for seeding...');

  // Clear existing data
  await Student.deleteMany({});
  await Attendance.deleteMany({});
  console.log('🗑  Cleared existing data');

  // ── Create Admin ───────────────────────────
  await Student.create({
    name:     'Admin User',
    email:    'admin@school.com',
    rollNum:  'ADMIN001',
    password: 'admin123',
    role:     'admin',
  });
  console.log('👤 Admin created: admin@school.com / admin123');

  // ── Create Students (one-by-one to trigger pre-save hook) ──
  const studentsData = [
    { name: 'Alice Johnson', email: 'alice@school.com', rollNum: 'CS001', password: 'student123' },
    { name: 'Bob Smith',     email: 'bob@school.com',   rollNum: 'CS002', password: 'student123' },
    { name: 'Carol White',   email: 'carol@school.com', rollNum: 'CS003', password: 'student123' },
    { name: 'David Brown',   email: 'david@school.com', rollNum: 'CS004', password: 'student123' },
    { name: 'Eva Green',     email: 'eva@school.com',   rollNum: 'CS005', password: 'student123' },
  ];

  const students = [];
  for (const s of studentsData) {
    const created = await Student.create({ ...s, role: 'student' });
    students.push(created);
  }
  console.log(`👥 ${students.length} students created`);

  // ── Seed 10 days of attendance ─────────────
  const today = new Date();
  for (let i = 9; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setUTCHours(0, 0, 0, 0);

    for (const student of students) {
      await Attendance.create({
        studentId: student._id,
        date,
        status: Math.random() > 0.25 ? 'Present' : 'Absent',
      });
    }
  }
  console.log('📅 Attendance seeded for 10 days');

  console.log('\n══════════════════════════════════════');
  console.log('✅ Seed complete!');
  console.log('  Admin:   admin@school.com  / admin123');
  console.log('  Student: alice@school.com  / student123');
  console.log('══════════════════════════════════════');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
