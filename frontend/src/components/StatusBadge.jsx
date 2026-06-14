const colors = {
  pending: 'bg-amber-100 text-amber-800',
  payment_uploaded: 'bg-sky-100 text-sky-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-teal-100 text-teal-800',
  cancelled: 'bg-rose-100 text-rose-800',
  verified: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800'
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors[status] || 'bg-slate-100 text-slate-700'}`}>
    {String(status || 'unknown').replace('_', ' ')}
  </span>
);

export default StatusBadge;
