import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doctorApi } from '../../api/services';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

const DoctorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    treatmentType: searchParams.get('treatmentType') || '',
    disease: searchParams.get('disease') || ''
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDoctors = async (nextFilters = filters) => {
    setLoading(true);
    const { data } = await doctorApi.list(nextFilters);
    setDoctors(data);
    setLoading(false);
  };

  useEffect(() => {
    loadDoctors(filters);
  }, []);

  const submit = (event) => {
    event.preventDefault();
    setSearchParams(filters);
    loadDoctors(filters);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-black">Find doctors</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_1fr_auto]">
        <input placeholder="Doctor name or specialty" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <select value={filters.treatmentType} onChange={(e) => setFilters({ ...filters, treatmentType: e.target.value })}>
          <option value="">Any treatment</option>
          <option>Allopathic</option>
          <option>Homeopathic</option>
          <option>Herbal</option>
        </select>
        <input placeholder="Disease" value={filters.disease} onChange={(e) => setFilters({ ...filters, disease: e.target.value })} />
        <Button>Apply</Button>
      </form>
      <div className="mt-6">
        {loading ? <Spinner label="Loading doctors" /> : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <Card key={doctor._id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{doctor.userId?.fullName || 'Doctor'}</h2>
                    <p className="text-sm text-slate-600">{doctor.specialty || 'Specialty not added'}</p>
                  </div>
                  <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-clinic">{doctor.treatmentType || 'General'}</span>
                </div>
                <p className="mt-4 text-sm text-slate-600">{doctor.bio || 'Verified Doctor Hub provider.'}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <span><b>{doctor.experienceYears || 0}</b> years</span>
                  <span><b>Rs. {doctor.consultationFee || 0}</b> fee</span>
                </div>
                <Link to={`/doctors/${doctor._id}`}><Button className="mt-5 w-full">View profile</Button></Link>
              </Card>
            ))}
            {!doctors.length && <p className="text-slate-600">No verified doctors found.</p>}
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorList;
