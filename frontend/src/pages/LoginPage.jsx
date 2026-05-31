import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../services/authService';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem('token')) return <Navigate to="/admin" replace />;

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      toast.success('Welcome');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={handle} className="bg-white p-8 border border-line rounded-card w-full max-w-md space-y-4">
        <h1 className="font-serif text-2xl font-bold text-center text-ink mb-2">{t('admin.login')}</h1>
        <div>
          <label className="text-sm font-medium text-sub">{t('admin.email')}</label>
          <input
            type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full mt-1 px-3 py-2.5 border border-line rounded-card outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-sub">{t('admin.password')}</label>
          <input
            type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full mt-1 px-3 py-2.5 border border-line rounded-card outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full bg-primary text-white py-2.5 rounded-card font-semibold hover:bg-primary-600 disabled:opacity-60"
        >
          {loading ? '...' : t('admin.login')}
        </button>
        <p className="text-xs text-center text-sub">
          Default: admin@journal.uz / admin123456
        </p>
      </form>
    </div>
  );
}
