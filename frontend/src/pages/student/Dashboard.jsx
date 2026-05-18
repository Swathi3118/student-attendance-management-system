// ─────────────────────────────────────────────
//  Student Dashboard
//  - Welcome banner
//  - Stats + animated Progress Ring
//  - Full attendance history
// ─────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import ProgressRing from '../../components/ProgressRing';
import AttendanceTable from '../../components/AttendanceTable';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats,    setStats]    = useState(null);
  const [records,  setRecords]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, recordsRes] = await Promise.all([
          api.get('/student/stats'),
          api.get('/student/attendance'),
        ]);
        setStats(statsRes.data);
        setRecords(recordsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statItems = stats
    ? [
        { icon: CalendarDays, label: 'Total Classes', value: stats.total,   color: 'bg-primary-600' },
        { icon: CheckCircle2, label: 'Present',        value: stats.present, color: 'bg-emerald-600' },
        { icon: XCircle,      label: 'Absent',         value: stats.absent,  color: 'bg-red-600' },
        { icon: TrendingUp,   label: 'Percentage',     value: `${stats.percentage}%`, color: 'bg-violet-600' },
      ]
    : [];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">

        {/* Welcome banner */}
        <div className="glass p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 animate-fade-in
                        bg-gradient-to-r from-primary-600/10 to-violet-600/10 border-primary-500/20">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-lg">
            {user?.name?.[0] ?? 'S'}
          </div>
          <div className="text-center sm:text-left">
            <p className="text-slate-400 text-sm">Welcome back,</p>
            <h1 className="font-heading font-bold text-2xl text-white">{user?.name}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{user?.rollNum} · {user?.email}</p>
          </div>
        </div>

        {/* Stats + Ring */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Stat cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {loading
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="stat-card animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-white/10" />
                    <div className="h-8 w-16 rounded bg-white/10 mt-1" />
                    <div className="h-3 w-20 rounded bg-white/5" />
                  </div>
                ))
              : statItems.map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="stat-card animate-fade-in">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <p className="text-3xl font-heading font-bold text-white mt-1">{value}</p>
                    <p className="text-slate-400 text-sm">{label}</p>
                  </div>
                ))}
          </div>

          {/* Progress Ring */}
          <div className="glass flex flex-col items-center justify-center p-6 animate-fade-in">
            <ProgressRing percentage={stats?.percentage ?? 0} size={160} />
            <p className="text-slate-400 text-sm mt-4 text-center">
              {stats?.percentage >= 75
                ? '✅ Great! Keep it up.'
                : stats?.percentage >= 50
                ? '⚠️ Needs improvement.'
                : '❌ Attendance is low.'}
            </p>
          </div>
        </div>

        {/* Attendance History */}
        <div className="animate-fade-in">
          <h2 className="font-heading font-semibold text-lg text-white mb-4">Attendance History</h2>
          {loading
            ? <div className="glass p-10 text-center text-slate-500">Loading records…</div>
            : <AttendanceTable records={records} />}
        </div>
      </main>
    </div>
  );
}
