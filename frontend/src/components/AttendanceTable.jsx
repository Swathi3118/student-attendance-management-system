// ─────────────────────────────────────────────
//  AttendanceTable — Reusable attendance records table
//  Props: records (array), showStudent (bool)
// ─────────────────────────────────────────────
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });

export default function AttendanceTable({ records = [], showStudent = false }) {
  if (!records.length) {
    return (
      <div className="table-wrapper p-10 text-center text-slate-500">
        No attendance records found.
      </div>
    );
  }

  return (
    <div className="table-wrapper overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            {showStudent && <th>Student</th>}
            <th>Date</th>
            <th>Day</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, i) => (
            <tr key={rec._id} className="animate-fade-in">
              <td className="text-slate-500 w-10">{i + 1}</td>
              {showStudent && (
                <td>
                  <div className="font-medium">{rec.studentId?.name || '—'}</div>
                  <div className="text-xs text-slate-500">{rec.studentId?.rollNum}</div>
                </td>
              )}
              <td>{new Date(rec.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              <td className="text-slate-400">{new Date(rec.date).toLocaleDateString('en-IN', { weekday: 'long' })}</td>
              <td>
                {rec.status === 'Present' ? (
                  <span className="badge-present">● Present</span>
                ) : (
                  <span className="badge-absent">● Absent</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
