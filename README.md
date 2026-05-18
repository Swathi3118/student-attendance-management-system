# 📋 EduTrack — Student Attendance Management System

A full-stack **MERN** application with role-based access (Admin & Student), JWT authentication, and a premium dark glassmorphism UI.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **or** a MongoDB Atlas URI

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Copy the env template and fill in your values:
```bash
copy .env.example .env
```

Edit `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=your_very_secret_key_here
PORT=5000
```

Seed the database (creates admin + 5 students + 10 days of attendance):
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```
> API is now available at `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
> App opens at `http://localhost:5173`

---

## 🔐 Default Credentials (after seeding)

| Role    | Email                | Password     |
|---------|----------------------|--------------|
| Admin   | admin@school.com     | admin123     |
| Student | alice@school.com     | student123   |
| Student | bob@school.com       | student123   |
| Student | carol@school.com     | student123   |

---

## 🗂 Project Structure

```
student attendance management system/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   └── studentController.js
│   ├── middleware/authMiddleware.js
│   ├── models/
│   │   ├── Student.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   └── studentRoutes.js
│   ├── seed.js
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── ProgressRing.jsx
    │   │   ├── AttendanceTable.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── admin/Dashboard.jsx
    │   │   ├── admin/MarkAttendance.jsx
    │   │   ├── admin/StudentReport.jsx
    │   │   └── student/Dashboard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── vite.config.js (proxies /api → localhost:5000)
```

---

## 🌐 API Endpoints

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Any | Get profile |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/students` | Admin | List students |
| POST | `/api/admin/students` | Admin | Add student |
| DELETE | `/api/admin/students/:id` | Admin | Delete student |
| POST | `/api/admin/attendance` | Admin | Mark attendance |
| GET | `/api/admin/attendance?date=` | Admin | Records by date |
| GET | `/api/admin/attendance/:id` | Admin | Student report |
| GET | `/api/student/attendance` | Student | Own records |
| GET | `/api/student/stats` | Student | Own stats |

---

## ☁️ MongoDB Atlas (Optional)

Replace `MONGO_URI` in `.env` with your Atlas connection string:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/attendance_db?retryWrites=true&w=majority
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Lucide React |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (localStorage), Bcrypt |
| HTTP Client | Axios |
