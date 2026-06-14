import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/services';
import Button from '../../components/Button';
import Card from '../../components/Card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.forgotPassword({ email });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-black">Forgot password</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
        </form>
      </Card>
    </section>
  );
};

export default ForgotPassword;
