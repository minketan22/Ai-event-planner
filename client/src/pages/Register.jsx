import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from './Login';
import { apiErrorMessage } from '../api';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const submit = async (event) => {
    event.preventDefault();
    if (form.name.trim().length < 2) return setError('Enter your name using at least 2 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Use a password with at least 6 characters.');
    setLoading(true); setError('');
    try { await register(form); navigate('/'); }
    catch (err) { setError(apiErrorMessage(err, 'Unable to create your account.')); }
    finally { setLoading(false); }
  };
  return <AuthLayout title="Make room for good plans" subtitle="Build thoughtful events without the busywork.">
    <form onSubmit={submit} className="stack-form">
      <label>Name<input autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Email<input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="primary-button" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
      <p className="form-note">Already have an account? <Link to="/login">Sign in</Link></p>
    </form>
  </AuthLayout>;
}
