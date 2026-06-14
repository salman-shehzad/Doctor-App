import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { appointmentApi, paymentApi } from '../../api/services';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DashboardHeader from '../../components/DashboardHeader';
import Spinner from '../../components/Spinner';

const AssistantDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await appointmentApi.assistant();
    setAppointments(data);
    const pairs = await Promise.all(data.map((appt) => paymentApi.byAppointment(appt._id).then((res) => [appt._id, res.data]).catch(() => [appt._id, null])));
    setPayments(Object.fromEntries(pairs));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const verify = async (paymentId, status) => {
    await paymentApi.verify(paymentId, status);
    toast.success(`Payment ${status}`);
    load();
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <DashboardHeader title="Assistant Dashboard" subtitle="Review uploaded payment screenshots and confirm appointments." />
      {loading ? <Spinner /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {appointments.map((appt) => {
            const payment = payments[appt._id];
            return (
              <Card key={appt._id}>
                <h3 className="font-bold">{appt.patientId?.fullName}</h3>
                <p className="mt-1 text-sm text-slate-600">{appt.doctorId?.userId?.fullName} · {new Date(appt.appointmentDate).toLocaleDateString()}</p>
                {payment?.screenshotUrl && <img src={payment.screenshotUrl} alt="Payment screenshot" className="mt-4 h-56 w-full rounded-lg object-cover" />}
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => verify(payment._id, 'verified')} disabled={!payment}>Verify</Button>
                  <Button variant="danger" onClick={() => verify(payment._id, 'rejected')} disabled={!payment}>Reject</Button>
                </div>
              </Card>
            );
          })}
          {!appointments.length && <p className="text-slate-600">No payments waiting for verification.</p>}
        </div>
      )}
    </section>
  );
};

export default AssistantDashboard;
