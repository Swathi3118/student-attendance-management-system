// ─────────────────────────────────────────────
//  App — Root with routing
// ─────────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login              from './pages/Login';
import AdminDashboard     from './pages/admin/Dashboard';
import MarkAttendance     from './pages/admin/MarkAttendance';
import StudentReport      from './pages/admin/StudentReport';
import StudentDashboard   from './pages/student/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin"                    element={<AdminDashboard />} />
            <Route path="/admin/mark-attendance"    element={<MarkAttendance />} />
            <Route path="/admin/report/:studentId"  element={<StudentReport />} />
          </Route>

          {/* Student routes */}
          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
