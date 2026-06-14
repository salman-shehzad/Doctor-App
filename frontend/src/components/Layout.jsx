import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CalendarDays, HeartPulse, LogOut, Mail, MapPin, Search, ShieldCheck, Stethoscope } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const dashboards = {
  patient: '/dashboard/patient',
  doctor: '/dashboard/doctor',
  assistant: '/dashboard/assistant',
  admin: '/dashboard/admin',
  super_admin: '/dashboard/super-admin'
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="sticky top-0 z-20 border-b border-teal-700 bg-clinic text-white shadow-lg shadow-teal-950/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-black text-white">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-clinic"><Stethoscope size={20} /></span>
            Doctor Hub
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/doctors" className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"><Search size={16} className="mr-1 inline" /> Doctors</NavLink>
            {user && <NavLink to={dashboards[user.role]} className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"><CalendarDays size={16} className="mr-1 inline" /> Dashboard</NavLink>}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20 sm:inline-flex"><ShieldCheck size={14} className="mr-1" />{user.role.replace('_', ' ')}</span>
                <Button variant="header" onClick={signOut}><LogOut size={16} /> Logout</Button>
              </>
            ) : (
              <>
                <Link to="/auth/login"><Button variant="header">Login</Button></Link>
                <Link to="/auth/register"><Button variant="light">Register</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-2 text-xl font-black">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-clinic text-white"><HeartPulse size={22} /></span>
              Doctor Hub
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">A healthcare workspace for doctor discovery, appointment requests, approvals, payments, and patient records.</p>
          </div>
          <div>
            <h2 className="font-bold">Quick Links</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <Link to="/doctors" className="hover:text-white">Doctors</Link>
              {user && <Link to={dashboards[user.role]} className="hover:text-white">Dashboard</Link>}
              {!user && <Link to="/auth/login" className="hover:text-white">Login</Link>}
            </div>
          </div>
          <div>
            <h2 className="font-bold">Contact</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2"><Mail size={16} /> support@doctorhub.local</span>
              <span className="inline-flex items-center gap-2"><MapPin size={16} /> Pakistan</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400">
          (c) 2026 Doctor Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
