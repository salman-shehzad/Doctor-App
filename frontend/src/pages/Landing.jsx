import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, CalendarCheck, CheckCircle2, Clock, Search, ShieldPlus, Sparkles, Video } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const treatments = ['Allopathic', 'Homeopathic', 'Herbal'];

const Landing = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const runSearch = (treatmentType) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (treatmentType) params.set('treatmentType', treatmentType);
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <>
      <section className="overflow-hidden bg-slate-100">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-clinic"><CheckCircle2 size={16} /> Verified care, simple booking</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-ink md:text-6xl">Doctor Hub</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Find trusted doctors, send an appointment request, and get approval updates from your patient dashboard.</p>
            <div className="mt-8 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-lg shadow-teal-900/5 sm:flex-row">
              <input placeholder="Search disease or doctor name" value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button onClick={() => runSearch()}><Search size={18} /> Search</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {treatments.map((type) => <Button key={type} variant="secondary" onClick={() => runSearch(type)}>{type}</Button>)}
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ['Request', 'Send booking to doctor'],
                ['Approve', 'Doctor confirms visit'],
                ['Notify', 'Patient sees update']
              ].map(([title, text]) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-ink">{title}</p>
                  <p className="mt-1 text-sm text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-2xl shadow-teal-900/10">
              <img src="/care-community.png" alt="Doctor Hub care community" className="mx-auto h-64 w-64 object-contain md:h-80 md:w-80" />
              <div className="mt-5 grid gap-3">
              {['Search doctors', 'Book appointment', 'Upload payment', 'Receive prescription'].map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-lg bg-white/90 p-4 shadow-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-clinic font-bold text-white">{index + 1}</span>
                  <span className="font-semibold">{step}</span>
                </div>
              ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-ink p-4 text-white">
                <Clock size={18} />
                <span className="text-sm font-semibold">Doctor approval notifications appear in patient dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
        <Card><ShieldPlus className="text-clinic" /><h2 className="mt-3 font-bold">Role-protected care</h2><p className="mt-2 text-sm text-slate-600">Patient, doctor, assistant, admin, and super admin workflows stay separate.</p></Card>
        <Card><CalendarCheck className="text-clinic" /><h2 className="mt-3 font-bold">Appointment workflow</h2><p className="mt-2 text-sm text-slate-600">Bookings move from pending to payment uploaded, confirmed, then completed.</p></Card>
        <Card><Sparkles className="text-clinic" /><h2 className="mt-3 font-bold">Clinical records</h2><p className="mt-2 text-sm text-slate-600">Medical history and prescriptions are created as permanent visit records.</p></Card>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-4 md:grid-cols-2">
          <Card><Brain className="text-coral" /><h2 className="mt-3 font-bold">AI disease prediction <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">Coming Soon</span></h2><input disabled className="mt-4" placeholder="Describe symptoms" /></Card>
          <Card><Video className="text-coral" /><h2 className="mt-3 font-bold">Video consultation <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">Coming Soon</span></h2><Link to="/doctors"><Button className="mt-4">Browse doctors</Button></Link></Card>
        </div>
      </section>
    </>
  );
};

export default Landing;
