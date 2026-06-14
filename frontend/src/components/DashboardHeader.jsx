const DashboardHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <p className="text-sm font-semibold uppercase tracking-wide text-clinic">Doctor Hub</p>
    <h1 className="mt-1 text-3xl font-black text-ink">{title}</h1>
    {subtitle && <p className="mt-2 max-w-3xl text-slate-600">{subtitle}</p>}
  </div>
);

export default DashboardHeader;
