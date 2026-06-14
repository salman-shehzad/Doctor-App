import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Video } from 'lucide-react';
import { clinicApi, doctorApi } from '../../api/services';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([doctorApi.detail(id), clinicApi.byDoctor(id)]).then(([doctorRes, clinicRes]) => {
      setDoctor(doctorRes.data);
      setClinics(clinicRes.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <section className="mx-auto max-w-7xl px-4 py-10"><Spinner label="Loading profile" /></section>;
  if (!doctor) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="font-semibold text-clinic">{doctor.treatmentType || 'General practice'}</p>
          <h1 className="mt-2 text-4xl font-black">{doctor.userId?.fullName}</h1>
          <p className="mt-2 text-lg text-slate-600">{doctor.specialty}</p>
          <p className="mt-5 max-w-3xl text-slate-700">{doctor.bio || 'This doctor has not added a full bio yet.'}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(doctor.diseasesTreated || []).map((disease) => <span key={disease} className="rounded-full bg-slate-100 px-3 py-1 text-sm">{disease}</span>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={`/book/${doctor._id}`}><Button>Book Appointment</Button></Link>
            <Button variant="secondary" disabled><Video size={16} /> Video Consultation Coming Soon</Button>
          </div>
        </div>
        <Card>
          <h2 className="text-lg font-bold">Visit details</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p><b>Experience:</b> {doctor.experienceYears || 0} years</p>
            <p><b>Fee:</b> Rs. {doctor.consultationFee || 0}</p>
            <p><b>Email:</b> {doctor.userId?.email}</p>
            <p><b>Phone:</b> {doctor.userId?.phone || 'Not added'}</p>
          </div>
        </Card>
      </div>
      <h2 className="mt-10 text-2xl font-black">Clinics</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {clinics.map((clinic) => (
          <Card key={clinic._id}>
            <h3 className="font-bold">{clinic.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{clinic.address}, {clinic.city}</p>
            <p className="mt-2 text-sm">{clinic.workingDays?.join(', ')} · {clinic.workingHours?.start} - {clinic.workingHours?.end}</p>
            {clinic.mapLink && <a className="mt-3 inline-flex text-sm font-semibold text-clinic" href={clinic.mapLink} target="_blank" rel="noreferrer">Open map</a>}
          </Card>
        ))}
        {!clinics.length && <p className="text-slate-600">No clinics added yet.</p>}
      </div>
    </section>
  );
};

export default DoctorProfile;
