import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { appointmentApi, clinicApi, doctorApi } from '../../api/services';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState({ clinicId: '', appointmentDate: '', appointmentTime: '', patientNotes: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([doctorApi.detail(doctorId), clinicApi.byDoctor(doctorId)]).then(([doctorRes, clinicRes]) => {
      setDoctor(doctorRes.data);
      setClinics(clinicRes.data);
      setForm((prev) => ({ ...prev, clinicId: clinicRes.data[0]?._id || '' }));
      setLoading(false);
    });
  }, [doctorId]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await appointmentApi.book({ ...form, doctorId });
      toast.success('Appointment request sent to doctor.');
      navigate('/dashboard/patient');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <section className="mx-auto max-w-3xl px-4 py-10"><Spinner label="Preparing booking" /></section>;

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <h1 className="text-2xl font-black">Book appointment</h1>
        <p className="mt-2 text-slate-600">{doctor?.userId?.fullName} · Rs. {doctor?.consultationFee || 0}</p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <select value={form.clinicId} onChange={(e) => setForm({ ...form, clinicId: e.target.value })} required>
            {clinics.map((clinic) => <option key={clinic._id} value={clinic._id}>{clinic.name} - {clinic.city}</option>)}
          </select>
          <input type="date" value={form.appointmentDate} onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })} required />
          <input type="time" value={form.appointmentTime} onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })} required />
          <textarea rows="4" placeholder="Notes for doctor" value={form.patientNotes} onChange={(e) => setForm({ ...form, patientNotes: e.target.value })} />
          <Button disabled={!clinics.length}>Submit booking</Button>
        </form>
      </Card>
    </section>
  );
};

export default BookAppointment;
