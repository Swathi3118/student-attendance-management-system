// ─────────────────────────────────────────────
//  Entry point — Express server
// ─────────────────────────────────────────────
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ── Routes ──────────────────────────────────
app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/admin',   require('./routes/adminRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

// ── Health check ────────────────────────────
app.get('/', (req, res) => res.json({ message: 'Attendance API is running ✅' }));

// ── Start server ─────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
