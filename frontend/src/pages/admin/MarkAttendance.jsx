// ─────────────────────────────────────────────
//  Mark Attendance — Admin page
//  Date picker → load students → toggle each → submit
// ─────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Send, CalendarDays, RefreshCw } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const toLocalDateStr = (d = new Date()) => {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function MarkAttendance() {
  const [date,       setDate]       = useState(toLocalDateStr());
  const [students,   setStudents]   = useState([]);
  const [statuses,   setStatuses]   = useState({});
  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message,    setMessage]    = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [studentsRes, existingRes] = await Promise.all([
        api.get('/admin/students'),
        api.get(`/admin/attendance?date=${date}`),
      ]);

      const list = studentsRes.data;
      setStudents(list);

      const existing = {};
      existingRes.data.forEach(rec => {
        existing[rec.studentId._id] = rec.status;
      });

      const initial = {};
      list.forEach(s => { initial[s._id] = existing[s._id] || 'Present'; });
      setStatuses(initial);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStudents(); }, [date]); // eslint-disable-line

  const toggleStatus = (id) =>
    setStatuses(prev => ({ ...prev, [id]: prev[id] === 'Present' ? 'Absent' : 'Present' }));

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s._id] = status; });
    setStatuses(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      const attendanceList = students.map(s => ({ studentId: s._id, status: statuses[s._id] }));
      await api.post('/admin/attendance', { date, attendanceList });
      setMessage({ type: 'success', text: `Attendance saved for ${new Date(date + 'T00:00:00').toDateString()}` });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save attendance' });
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = Object.values(statuses).filter(v => v === 'Present').length;
  const absentCount  = students.length - presentCount;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-heading font-bold text-2xl text-white">Mark Attendance</h1>
          <p className="text-slate-400 text-sm mt-0.5">Select a date and toggle each student's status</p>
        </div>

        {/* Controls */}
        <div className="glass p-5 mb-6 flex flex-wrap items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <CalendarDays size={18} className="text-primary-400" />
            <input
              id="input-date"
              type="date"
              value={date}
              max={toLocalDateStr()}
              onChange={e => setDate(e.target.value)}
              className="input py-2 text-sm w-44"
            />
          </div>
          <button id="btn-reload" onClick={loadStudents} className="btn-ghost py-2 text-sm">
            <RefreshCw size={14} /> Reload
          </button>
          <div className="ml-auto flex gap-2">
            <button id="btn-mark-all-present" onClick={() => markAll('Present')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/10 transition-colors">
              <CheckCircle2 size={14} /> All Present
            </button>
            <button id="btn-mark-all-absent" onClick={() => markAll('Absent')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors">
              <XCircle size={14} /> All Absent
            </button>
          </div>
        </div>

        {/* Summary */}
        {students.length > 0 && (
          <div className="flex gap-4 mb-5 animate-fade-in">
            <div className="glass px-4 py-2.5 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-white font-bold">{presentCount}</span>
              <span className="text-slate-400 text-sm">Present</span>
            </div>
            <div className="glass px-4 py-2.5 flex items-center gap-2">
              <XCircle size={16} className="text-red-400" />
              <span className="text-white font-bold">{absentCount}</span>
              <span className="text-slate-400 text-sm">Absent</span>
            </div>
            <div className="glass px-4 py-2.5 flex items-center gap-2">
              <span className="text-white font-bold">{students.length}</span>
              <span className="text-slate-400 text-sm">Total</span>
            </div>
          </div>
        )}

        {/* Feedback */}
        {message && (
          <div className={`mb-5 px-4 py-3 rounded-xl text-sm border animate-fade-in
            ${message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {message.text}
          </div>
        )}

        {/* Student list */}
        {loading ? (
          <div className="glass p-10 text-center text-slate-500">Loading students…</div>
        ) : (
          <div className="space-y-2 animate-fade-in">
            {students.map((s, i) => {
              const isPresent = statuses[s._id] === 'Present';
              return (
                <div
                  key={s._id}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer
                    ${isPresent
                      ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                      : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'}`}
                  onClick={() => toggleStatus(s._id)}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs text-slate-400 font-mono">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-white">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.rollNum} · {s.email}</p>
                    </div>
                  </div>

                  <button
                    id={`btn-toggle-${s._id}`}
                    onClick={e => { e.stopPropagation(); toggleStatus(s._id); }}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all
                      ${isPresent
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'}`}
                  >
                    {isPresent
                      ? <><CheckCircle2 size={15} /> Present</>
                      : <><XCircle size={15} /> Absent</>}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Submit */}
        {students.length > 0 && (
          <div className="mt-6 flex justify-end animate-fade-in">
            <button
              id="btn-submit-attendance"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary px-8"
            >
              {submitting
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Send size={16} />}
              {submitting ? 'Saving…' : 'Save Attendance'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
