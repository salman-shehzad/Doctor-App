import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminApi } from '../../api/services';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DashboardHeader from '../../components/DashboardHeader';
import Spinner from '../../components/Spinner';

const colors = ['#0f766e', '#e76f51', '#f4a261', '#457b9d', '#8ac926'];

const AdminDashboard = ({ superAdmin = false }) => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [usersRes, statsRes, doctorsRes] = await Promise.all([adminApi.users(), adminApi.stats(), adminApi.doctors()]);
    setUsers(usersRes.data);
    setStats(statsRes.data);
    setDoctors(doctorsRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const removeUser = async (id) => {
    await adminApi.deleteUser(id);
    toast.success('User deleted');
    load();
  };

  const toggleDoctor = async (doctor) => {
    await adminApi.verifyDoctor(doctor._id, !doctor.isVerified);
    toast.success(doctor.isVerified ? 'Doctor unverified' : 'Doctor verified');
    load();
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <DashboardHeader title={superAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'} subtitle="Review users, doctor verification, operational stats, and healthcare trends." />
      {loading ? <Spinner /> : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {Object.entries(stats.cards).map(([key, value]) => (
              <Card key={key}><p className="text-sm text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</p><p className="mt-2 text-3xl font-black">{value}</p></Card>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <h2 className="font-bold">Appointments by status</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart><Pie data={stats.appointmentStatuses} dataKey="value" nameKey="name">{stats.appointmentStatuses.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <h2 className="font-bold">Doctors by treatment</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.treatmentTypes}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#0f766e" /></BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <h2 className="font-bold">New users per month</h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={stats.monthlyUsers}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="count" stroke="#e76f51" strokeWidth={3} /></LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="text-xl font-black">Doctor Verification</h2>
              <div className="mt-4 space-y-3">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm">
                    <span>{doctor.userId?.fullName} · {doctor.treatmentType || 'Unspecified'}</span>
                    <Button variant={doctor.isVerified ? 'secondary' : 'primary'} onClick={() => toggleDoctor(doctor)}>{doctor.isVerified ? 'Unverify' : 'Verify'}</Button>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h2 className="text-xl font-black">Users</h2>
              <div className="mt-4 max-h-[520px] space-y-3 overflow-auto">
                {users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm">
                    <span><b>{user.fullName}</b><br />{user.email} · {user.role.replace('_', ' ')}</span>
                    {superAdmin && <Button variant="danger" onClick={() => removeUser(user._id)}>Delete</Button>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
