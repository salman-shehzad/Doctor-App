import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/services';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.register(form);
      login(data);
      toast.success('Account created');
      navigate(data.user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl place-items-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <h1 className="text-2xl font-black">Create your Doctor Hub account</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <input placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          <Button disabled={loading}>{loading ? 'Creating...' : 'Register'}</Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">Already registered? <Link className="font-semibold text-clinic" to="/auth/login">Login</Link></p>
      </Card>
    </section>
  );
};

export default Register;
