import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle } from 'lucide-react';
import { appointmentApi, clinicApi, doctorApi, historyApi, prescriptionApi } from '../../api/services';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DashboardHeader from '../../components/DashboardHeader';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';

const emptyClinic = { name: '', address: '', city: '', mapLink: '', workingDays: 'Monday,Tuesday,Wednesday', start: '09:00', end: '17:00' };
const emptyRecord = { appointmentId: '', diagnosis: '', symptoms: '', notes: '', medicines: [{ name: '', dosage: '', duration: '', instructions: '' }] };

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [clinicForm, setClinicForm] = useState(emptyClinic);
  const [editingClinicId, setEditingClinicId] = useState(null);
  const [record, setRecord] = useState(emptyRecord);
  const [loading, setLoading] = useState(true);

  const pending = useMemo(() => appointments.filter((appt) => appt.status === 'pending'), [appointments]);
  const confirmed = useMemo(() => appointments.filter((appt) => ['confirmed', 'completed'].includes(appt.status)), [appointments]);

  const load = async () => {
    const [apptRes, doctorRes] = await Promise.all([appointmentApi.doctor(), doctorApi.me()]);
    setAppointments(apptRes.data);
    if (doctorRes.data) {
      setDoctor(doctorRes.data);
      const clinicRes = await clinicApi.byDoctor(doctorRes.data._id);
      setClinics(clinicRes.data);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveProfile = async () => {
    if (!doctor?._id) return;
    const { data } = await doctorApi.update(doctor._id, doctor);
    setDoctor(data);
    toast.success('Profile updated');
  };

  const saveClinic = async (event) => {
    event.preventDefault();
    const payload = {
      name: clinicForm.name,
      address: clinicForm.address,
      city: clinicForm.city,
      mapLink: clinicForm.mapLink,
      workingDays: clinicForm.workingDays.split(',').map((day) => day.trim()).filter(Boolean),
      workingHours: { start: clinicForm.start, end: clinicForm.end }
    };
    if (editingClinicId) await clinicApi.update(editingClinicId, payload);
    else await clinicApi.create(payload);
    setClinicForm(emptyClinic);
    setEditingClinicId(null);
    toast.success(editingClinicId ? 'Clinic updated' : 'Clinic added');
    if (doctor?._id) setClinics((await clinicApi.byDoctor(doctor._id)).data);
  };

  const editClinic = (clinic) => {
    setEditingClinicId(clinic._id);
    setClinicForm({
      name: clinic.name || '',
      address: clinic.address || '',
      city: clinic.city || '',
      mapLink: clinic.mapLink || '',
      workingDays: (clinic.workingDays || []).join(', '),
      start: clinic.workingHours?.start || '09:00',
      end: clinic.workingHours?.end || '17:00'
    });
  };

  const deleteClinic = async (id) => {
    await clinicApi.remove(id);
    toast.success('Clinic deleted');
    if (doctor?._id) setClinics((await clinicApi.byDoctor(doctor._id)).data);
  };

  const addRecord = async (event) => {
    event.preventDefault();
    const history = await historyApi.create(record);
    await prescriptionApi.create({ medicalHistoryId: history.data._id, medicines: record.medicines });
    await appointmentApi.status(record.appointmentId, 'completed');
    setRecord(emptyRecord);
    toast.success('History and prescription added');
    load();
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    await appointmentApi.status(appointmentId, status);
    toast.success(status === 'confirmed' ? 'Appointment approved and patient notified' : 'Appointment cancelled');
    load();
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <DashboardHeader title="Doctor Dashboard" subtitle="Manage confirmed visits, clinics, profile details, and consultation records." />
      {loading ? <Spinner /> : (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-black">Profile</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input placeholder="Specialty" value={doctor?.specialty || ''} onChange={(e) => setDoctor({ ...doctor, specialty: e.target.value })} />
                <select value={doctor?.treatmentType || ''} onChange={(e) => setDoctor({ ...doctor, treatmentType: e.target.value })}>
                  <option value="">Treatment type</option><option>Allopathic</option><option>Homeopathic</option><option>Herbal</option>
                </select>
                <input placeholder="Experience years" type="number" value={doctor?.experienceYears || ''} onChange={(e) => setDoctor({ ...doctor, experienceYears: e.target.value })} />
                <input placeholder="Consultation fee" type="number" value={doctor?.consultationFee || ''} onChange={(e) => setDoctor({ ...doctor, consultationFee: e.target.value })} />
                <input className="md:col-span-2" placeholder="Diseases, comma separated" value={(doctor?.diseasesTreated || []).join(', ')} onChange={(e) => setDoctor({ ...doctor, diseasesTreated: e.target.value.split(',').map((d) => d.trim()) })} />
                <textarea className="md:col-span-2" placeholder="Bio" value={doctor?.bio || ''} onChange={(e) => setDoctor({ ...doctor, bio: e.target.value })} />
              </div>
              <Button className="mt-4" onClick={saveProfile} disabled={!doctor?._id}>Save profile</Button>
              {!doctor && <p className="mt-3 text-sm text-slate-600">Bookable doctor profile will appear after appointments exist or admin links the doctor record.</p>}
            </Card>
            <Card>
              <h2 className="text-xl font-black">Clinics</h2>
              <form onSubmit={saveClinic} className="mt-4 grid gap-3 md:grid-cols-2">
                <input placeholder="Clinic name" value={clinicForm.name} onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })} required />
                <input placeholder="City" value={clinicForm.city} onChange={(e) => setClinicForm({ ...clinicForm, city: e.target.value })} />
                <input className="md:col-span-2" placeholder="Address" value={clinicForm.address} onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })} required />
                <input placeholder="Map link" value={clinicForm.mapLink} onChange={(e) => setClinicForm({ ...clinicForm, mapLink: e.target.value })} />
                <input placeholder="Working days" value={clinicForm.workingDays} onChange={(e) => setClinicForm({ ...clinicForm, workingDays: e.target.value })} />
                <input type="time" value={clinicForm.start} onChange={(e) => setClinicForm({ ...clinicForm, start: e.target.value })} />
                <input type="time" value={clinicForm.end} onChange={(e) => setClinicForm({ ...clinicForm, end: e.target.value })} />
                <Button>{editingClinicId ? 'Update clinic' : 'Add clinic'}</Button>
              </form>
              <div className="mt-4 grid gap-3">
                {clinics.map((clinic) => (
                  <div key={clinic._id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm">
                    <span><b>{clinic.name}</b> · {clinic.city}</span>
                    <span className="flex gap-2">
                      <Button variant="secondary" onClick={() => editClinic(clinic)}>Edit</Button>
                      <Button variant="danger" onClick={() => deleteClinic(clinic._id)}>Delete</Button>
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-black">Appointment Requests</h2>
              <p className="mt-1 text-sm text-slate-600">New patient requests arrive here for approval.</p>
              <div className="mt-4 space-y-3">
                {pending.map((appt) => (
                  <div key={appt._id} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <b>{appt.patientId?.fullName}</b>
                        <p className="text-sm text-slate-600">{new Date(appt.appointmentDate).toLocaleDateString()} · {appt.appointmentTime}</p>
                        <p className="text-sm text-slate-600">{appt.clinicId?.name}</p>
                        {appt.patientNotes && <p className="mt-2 text-sm text-slate-700">{appt.patientNotes}</p>}
                      </div>
                      <StatusBadge status={appt.status} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button onClick={() => updateAppointmentStatus(appt._id, 'confirmed')}><CheckCircle2 size={18} /> Approve</Button>
                      <Button variant="danger" onClick={() => updateAppointmentStatus(appt._id, 'cancelled')}><XCircle size={18} /> Cancel</Button>
                    </div>
                  </div>
                ))}
                {!pending.length && <p className="text-sm text-slate-600">No pending appointment requests.</p>}
              </div>
            </Card>
            <Card>
              <h2 className="text-xl font-black">Confirmed Appointments</h2>
              <div className="mt-4 space-y-3">
                {confirmed.map((appt) => (
                  <div key={appt._id} className="rounded-lg bg-slate-50 p-3">
                    <div className="flex justify-between gap-2"><b>{appt.patientId?.fullName}</b><StatusBadge status={appt.status} /></div>
                    <p className="text-sm text-slate-600">{new Date(appt.appointmentDate).toLocaleDateString()} · {appt.appointmentTime}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h2 className="text-xl font-black">Add Medical History + Prescription</h2>
              <form onSubmit={addRecord} className="mt-4 grid gap-3">
                <select value={record.appointmentId} onChange={(e) => setRecord({ ...record, appointmentId: e.target.value })} required>
                  <option value="">Select confirmed appointment</option>
                  {confirmed.map((appt) => <option key={appt._id} value={appt._id}>{appt.patientId?.fullName} - {appt.appointmentTime}</option>)}
                </select>
                <input placeholder="Diagnosis" value={record.diagnosis} onChange={(e) => setRecord({ ...record, diagnosis: e.target.value })} required />
                <input placeholder="Symptoms" value={record.symptoms} onChange={(e) => setRecord({ ...record, symptoms: e.target.value })} />
                <textarea placeholder="Notes" value={record.notes} onChange={(e) => setRecord({ ...record, notes: e.target.value })} />
                <input placeholder="Medicine" value={record.medicines[0].name} onChange={(e) => setRecord({ ...record, medicines: [{ ...record.medicines[0], name: e.target.value }] })} />
                <input placeholder="Dosage" value={record.medicines[0].dosage} onChange={(e) => setRecord({ ...record, medicines: [{ ...record.medicines[0], dosage: e.target.value }] })} />
                <input placeholder="Duration" value={record.medicines[0].duration} onChange={(e) => setRecord({ ...record, medicines: [{ ...record.medicines[0], duration: e.target.value }] })} />
                <Button>Save completed visit</Button>
              </form>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
};

export default DoctorDashboard;
