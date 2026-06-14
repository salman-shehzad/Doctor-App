import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Bell, CheckCircle2, CreditCard } from 'lucide-react';
import { appointmentApi, historyApi, paymentApi, prescriptionApi } from '../../api/services';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DashboardHeader from '../../components/DashboardHeader';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [history, setHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState({});
  const [loading, setLoading] = useState(true);
  const approvedAppointments = appointments.filter((appt) => appt.status === 'confirmed');

  const load = async () => {
    const [appointmentRes, historyRes] = await Promise.all([appointmentApi.patient(), historyApi.patient()]);
    setAppointments(appointmentRes.data);
    setHistory(historyRes.data);
    const pairs = await Promise.all(historyRes.data.map((item) => prescriptionApi.byHistory(item._id).then((res) => [item._id, res.data])));
    setPrescriptions(Object.fromEntries(pairs));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const upload = async (appointmentId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('appointmentId', appointmentId);
    formData.append('screenshot', file);
    try {
      await paymentApi.upload(formData);
      toast.success('Payment uploaded');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <DashboardHeader title="Patient Dashboard" subtitle="Track bookings, upload payment screenshots, and review completed visit records." />
      {loading ? <Spinner /> : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {!!approvedAppointments.length && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <Bell className="mt-1 shrink-0 text-emerald-700" size={22} />
                  <div>
                    <h2 className="font-black text-emerald-950">Approved appointment notification</h2>
                    <p className="mt-1 text-sm text-emerald-800">Your doctor approved {approvedAppointments.length === 1 ? 'this request' : `${approvedAppointments.length} requests`}. You can now upload payment proof from the appointment card.</p>
                  </div>
                </div>
              </div>
            )}
            <h2 className="text-xl font-black">Appointments</h2>
            {appointments.map((appt) => (
              <Card key={appt._id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{appt.doctorId?.userId?.fullName}</h3>
                    <p className="text-sm text-slate-600">{new Date(appt.appointmentDate).toLocaleDateString()} · {appt.appointmentTime}</p>
                    <p className="text-sm text-slate-600">{appt.clinicId?.name}</p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
                {appt.status === 'confirmed' && (
                  <div className="mt-4 flex items-start gap-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                    <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
                    <span>Approved by doctor. Upload your payment screenshot to continue.</span>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {appt.status === 'pending' && <span className="text-sm font-semibold text-amber-700">Waiting for doctor approval</span>}
                  {appt.status === 'confirmed' && (
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50">
                      <CreditCard size={18} />
                      Upload payment
                      <input className="hidden" type="file" accept="image/png,image/jpeg,image/jpg" onChange={(e) => upload(appt._id, e.target.files?.[0])} />
                    </label>
                  )}
                  {appt.status === 'payment_uploaded' && <span className="text-sm font-semibold text-sky-700">Payment sent for verification</span>}
                  <Link to={`/appointments/${appt._id}`}><Button variant="secondary">Details</Button></Link>
                </div>
              </Card>
            ))}
            {!appointments.length && <p className="text-slate-600">No appointments yet.</p>}
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-black">Medical History</h2>
            <Card>
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">WhatsApp notifications</span>
                <label className="inline-flex items-center gap-2 text-sm text-slate-500">
                  <input type="checkbox" disabled className="h-4 w-4" />
                  Coming Soon
                </label>
              </div>
            </Card>
            {history.map((item) => (
              <Card key={item._id}>
                <h3 className="font-bold">{item.diagnosis}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.symptoms}</p>
                <div className="mt-3 space-y-2">
                  {(prescriptions[item._id] || []).map((rx) => (
                    <div key={rx._id} className="rounded-lg bg-slate-50 p-3 text-sm">
                      {rx.medicines.map((med) => <p key={`${rx._id}-${med.name}`}><b>{med.name}</b> {med.dosage} · {med.duration}</p>)}
                      <Button className="mt-2" variant="secondary" disabled>E-prescription PDF Coming Soon</Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
            {!history.length && <p className="text-slate-600">No history records yet.</p>}
          </div>
        </div>
      )}
    </section>
  );
};

export default PatientDashboard;
