import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { appointmentApi, historyApi, paymentApi, prescriptionApi } from '../../api/services';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';

const AppointmentDetail = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [payment, setPayment] = useState(null);
  const [history, setHistory] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const apptRes = await appointmentApi.detail(id);
      setAppointment(apptRes.data);
      const paymentRes = await paymentApi.byAppointment(id).catch(() => ({ data: null }));
      setPayment(paymentRes.data);
      if (apptRes.data.status === 'completed') {
        const historyRes = await historyApi.byAppointment(id).catch(() => ({ data: null }));
        const record = historyRes.data;
        setHistory(record);
        if (record) setPrescriptions((await prescriptionApi.byHistory(record._id)).data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <section className="mx-auto max-w-4xl px-4 py-10"><Spinner /></section>;

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Appointment Detail</h1>
            <p className="mt-2 text-slate-600">{appointment?.doctorId?.userId?.fullName} · {appointment?.clinicId?.name}</p>
          </div>
          <StatusBadge status={appointment?.status} />
        </div>
        <div className="mt-6 grid gap-3 text-sm md:grid-cols-2">
          <p><b>Patient:</b> {appointment?.patientId?.fullName}</p>
          <p><b>Date:</b> {new Date(appointment?.appointmentDate).toLocaleDateString()}</p>
          <p><b>Time:</b> {appointment?.appointmentTime}</p>
          <p><b>Payment:</b> {payment ? <StatusBadge status={payment.status} /> : 'Not uploaded'}</p>
        </div>
      </Card>
      {history && (
        <Card className="mt-5">
          <h2 className="font-bold">Medical history</h2>
          <p className="mt-2"><b>Diagnosis:</b> {history.diagnosis}</p>
          <p className="mt-2 text-sm text-slate-600">{history.notes}</p>
          <h3 className="mt-4 font-bold">Prescription</h3>
          {prescriptions.map((rx) => rx.medicines.map((med) => <p key={`${rx._id}-${med.name}`} className="text-sm">{med.name} · {med.dosage} · {med.duration}</p>))}
        </Card>
      )}
    </section>
  );
};

export default AppointmentDetail;
