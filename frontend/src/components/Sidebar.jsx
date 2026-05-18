// ─────────────────────────────────────────────
//  Sidebar — Responsive collapsible sidebar
//  Role-aware: shows admin or student nav links
// ─────────────────────────────────────────────
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardCheck, Users, LogOut,
  GraduationCap, Menu, X, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin',               label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/admin/mark-attendance', label: 'Mark Attendance', icon: ClipboardCheck },
  { to: '/admin',               label: 'Students',        icon: Users, state: { tab: 'students' } },
];

const studentLinks = [
  { to: '/student', label: 'My Dashboard', icon: LayoutDashboard },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg">
          <GraduationCap size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-white text-base leading-none">EduTrack</h1>
          <p className="text-xs text-slate-500 mt-0.5 capitalize">{user?.role} Portal</p>
        </div>
      </div>

      {/* User chip */}
      <div className="mx-4 mt-4 mb-2 p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        {user?.rollNum && <p className="text-xs text-primary-400 mt-0.5">{user.rollNum}</p>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
               ${isActive
                ? 'bg-gradient-to-r from-primary-600/40 to-violet-600/20 text-white border border-primary-500/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`
            }
          >
            <Icon size={17} className="shrink-0" />
            {label}
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          id="btn-logout"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400
                     hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        id="btn-sidebar-toggle"
        onClick={() => setOpen(o => !o)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-300 hover:text-white"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-dark-800 border-r border-white/10 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-white/10
                    transform transition-transform duration-300 ease-out
                    ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
