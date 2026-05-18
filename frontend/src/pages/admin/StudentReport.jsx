// ─────────────────────────────────────────────
//  Student Report — Admin view of one student
// ─────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Hash, Mail } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import ProgressRing from '../../components/ProgressRing';
import AttendanceTable from '../../components/AttendanceTable';
import api from '../../api/axios';

export default function StudentReport() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data: res } = await api.get(`/admin/attendance/${studentId}`);
        setData(res);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [studentId]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">

        <button
          id="btn-back"
          onClick={() => navigate('/admin')}
          className="btn-ghost mb-6 text-sm py-2 animate-fade-in"
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </button>

        {loading && <div className="glass p-10 text-center text-slate-500">Loading report…</div>}
        {error   && <div className="glass p-6 text-center text-red-400">{error}</div>}

        {data && (
          <>
            {/* Student Info */}
            <div className="glass p-6 mb-6 flex flex-col lg:flex-row gap-6 items-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
                {data.student.name[0]}
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h1 className="font-heading font-bold text-2xl text-white">{data.student.name}</h1>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5"><Hash size={13} className="text-primary-400" />{data.student.rollNum}</span>
                  <span className="flex items-center gap-1.5"><Mail size={13} className="text-primary-400" />{data.student.email}</span>
                </div>
              </div>
              <ProgressRing percentage={data.stats.percentage} size={140} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Classes', value: data.stats.total,   color: 'text-white' },
                { label: 'Present',       value: data.stats.present, color: 'text-emerald-400' },
                { label: 'Absent',        value: data.stats.absent,  color: 'text-red-400' },
                { label: 'Percentage',    value: `${data.stats.percentage}%`, color: data.stats.percentage >= 75 ? 'text-emerald-400' : 'text-amber-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="stat-card animate-fade-in">
                  <p className={`text-3xl font-heading font-bold ${color}`}>{value}</p>
                  <p className="text-slate-400 text-sm">{label}</p>
                </div>
              ))}
            </div>

            {/* Records */}
            <div className="animate-fade-in">
              <h2 className="font-heading font-semibold text-lg text-white mb-4">Attendance History</h2>
              <AttendanceTable records={data.records} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
