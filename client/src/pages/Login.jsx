import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../api';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const submit = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.');
    if (!form.password) return setError('Enter your password.');
    setLoading(true); setError('');
    try { await login(form); navigate(location.state?.from?.pathname || '/'); }
    catch (err) { setError(apiErrorMessage(err, 'Unable to log in. Check your credentials.')); }
    finally { setLoading(false); }
  };
  return <AuthLayout title="Welcome back" subtitle="Your next great event starts here.">
    <form onSubmit={submit} className="stack-form">
      <label>Email<input type="email" autoComplete="email" aria-invalid={Boolean(error)} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="primary-button" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      <p className="form-note">New here? <Link to="/register">Create an account</Link></p>
    </form>
  </AuthLayout>;
}

export function AuthLayout({ title, subtitle, children }) {
  return <main className="auth-page"><section className="auth-intro"><Link className="brand" to="/login">Planwell<span>.</span></Link><div><p className="eyebrow">EVENTS, MADE CLEAR</p><h1>{title}</h1><p>{subtitle}</p></div></section><section className="auth-panel"><div className="auth-card">{children}</div></section></main>;
}
