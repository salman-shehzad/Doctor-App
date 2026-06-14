import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/services';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      login(data);
      toast.success('Welcome back');
      navigate(`/dashboard/${data.user.role === 'super_admin' ? 'super-admin' : data.user.role}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-black">Login</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <Link className="font-semibold text-clinic" to="/auth/forgot-password">Forgot password?</Link>
          <Link className="font-semibold text-clinic" to="/auth/register">Create account</Link>
        </div>
      </Card>
    </section>
  );
};

export default Login;
