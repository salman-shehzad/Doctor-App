const Spinner = ({ label = 'Loading' }) => (
  <div className="flex items-center gap-3 text-sm text-slate-600">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-clinic border-t-transparent" />
    {label}
  </div>
);

export default Spinner;
