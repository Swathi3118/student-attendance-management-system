// ─────────────────────────────────────────────
//  Admin Dashboard
//  - Stats cards (totals)
//  - Student management table (add / delete)
//  - Link to reports
// ─────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, UserX, ClipboardCheck,
  Plus, Trash2, BarChart2, Search, X,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card animate-fade-in">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={19} className="text-white" />
    </div>
    <p className="text-3xl font-heading font-bold text-white mt-1">{value ?? '—'}</p>
    <p className="text-slate-400 text-sm">{label}</p>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats,    setStats]    = useState(null);
  const [students, setStudents] = useState([]);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [showAdd,  setShowAdd]  = useState(false);
  const [form,     setForm]     = useState({ name: '', email: '', rollNum: '', password: '' });
  const [formErr,  setFormErr]  = useState('');
  const [adding,   setAdding]   = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/students'),
      ]);
      setStats(statsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNum.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFormErr('');
    setAdding(true);
    try {
      await api.post('/admin/students', form);
      setShowAdd(false);
      setForm({ name: '', email: '', rollNum: '', password: '' });
      fetchData();
    } catch (err) {
      setFormErr(err.response?.data?.message || 'Failed to add student');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This will also erase their attendance records.`)) return;
    try {
      await api.delete(`/admin/students/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="font-heading font-bold text-2xl text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage students and track attendance</p>
          </div>
          <button
            id="btn-mark-attendance"
            onClick={() => navigate('/admin/mark-attendance')}
            className="btn-primary"
          >
            <ClipboardCheck size={16} /> Mark Attendance
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users}     label="Total Students"  value={stats?.totalStudents}  color="bg-primary-600" />
          <StatCard icon={UserCheck} label="Present Today"   value={stats?.presentToday}   color="bg-emerald-600" />
          <StatCard icon={UserX}     label="Absent Today"    value={stats?.absentToday}    color="bg-red-600" />
          <StatCard icon={ClipboardCheck} label="Marked Today" value={stats?.markedToday} color="bg-violet-600" />
        </div>

        {/* Students Table */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h2 className="font-heading font-semibold text-lg text-white">All Students</h2>
            <div className="flex gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="input-search-students"
                  type="text"
                  placeholder="Search…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input pl-8 py-2 text-sm w-44"
                />
              </div>
              {/* Add student */}
              <button
                id="btn-add-student"
                onClick={() => setShowAdd(true)}
                className="btn-primary py-2 text-sm"
              >
                <Plus size={15} /> Add Student
              </button>
            </div>
          </div>

          {loading ? (
            <div className="glass p-10 text-center text-slate-500">Loading…</div>
          ) : (
            <div className="table-wrapper overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Roll No.</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-slate-500">No students found</td></tr>
                  ) : filtered.map((s, i) => (
                    <tr key={s._id} className="animate-fade-in">
                      <td className="text-slate-500">{i + 1}</td>
                      <td className="font-medium">{s.name}</td>
                      <td><span className="px-2 py-0.5 rounded-md bg-primary-600/20 text-primary-300 text-xs font-mono">{s.rollNum}</span></td>
                      <td className="text-slate-400">{s.email}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            id={`btn-report-${s._id}`}
                            onClick={() => navigate(`/admin/report/${s._id}`)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                                       bg-primary-600/20 text-primary-300 border border-primary-500/30
                                       hover:bg-primary-600/30 transition-colors"
                          >
                            <BarChart2 size={13} /> Report
                          </button>
                          <button
                            id={`btn-delete-${s._id}`}
                            onClick={() => handleDelete(s._id, s.name)}
                            className="btn-danger text-xs py-1.5"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Student Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass w-full max-w-md p-6 animate-fade-in shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-semibold text-lg text-white">Add New Student</h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>

              {formErr && (
                <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{formErr}</div>
              )}

              <form onSubmit={handleAddStudent} className="space-y-3">
                {[
                  { id: 'add-name',     name: 'name',     label: 'Full Name',     type: 'text',     placeholder: 'Alice Johnson' },
                  { id: 'add-email',    name: 'email',    label: 'Email',         type: 'email',    placeholder: 'alice@school.com' },
                  { id: 'add-rollnum',  name: 'rollNum',  label: 'Roll Number',   type: 'text',     placeholder: 'CS001' },
                  { id: 'add-password', name: 'password', label: 'Password',      type: 'password', placeholder: '••••••••' },
                ].map(({ id, name, label, type, placeholder }) => (
                  <div key={name}>
                    <label htmlFor={id} className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
                    <input
                      id={id} name={name} type={type} placeholder={placeholder}
                      value={form[name]}
                      onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))}
                      required
                      className="input text-sm"
                    />
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost flex-1 justify-center text-sm py-2">Cancel</button>
                  <button id="btn-confirm-add" type="submit" disabled={adding} className="btn-primary flex-1 justify-center text-sm py-2">
                    {adding ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={15} />}
                    {adding ? 'Adding…' : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
