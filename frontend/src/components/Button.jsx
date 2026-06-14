const styles = {
  primary: 'bg-clinic text-white hover:bg-teal-800',
  secondary: 'bg-white text-ink border border-slate-200 hover:bg-slate-50',
  danger: 'bg-coral text-white hover:bg-red-700',
  ghost: 'bg-transparent text-clinic hover:bg-teal-50',
  header: 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20',
  light: 'bg-white text-clinic hover:bg-emerald-50'
};

const Button = ({ children, variant = 'primary', className = '', ...props }) => (
  <button
    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
