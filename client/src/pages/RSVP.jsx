import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { apiErrorMessage } from '../api';

const initial = { name: '', email: '', phone: '', status: 'yes', dietaryPreference: '', plusOnes: '0' };

export default function RSVP() {
  const { token } = useParams();
  const [form, setForm] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (form.name.trim().length < 2) return setError('Enter your name using at least 2 characters.');
    if (!form.email.trim() && !form.phone.trim()) return setError('Add an email address or phone number so the host can identify your RSVP.');
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.');
    if (!Number.isInteger(Number(form.plusOnes)) || Number(form.plusOnes) < 0) return setError('Plus ones must be zero or a positive whole number.');
    setLoading(true); setError('');
    try { await api.post(`/rsvp/${token}`, { ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), plusOnes: Number(form.plusOnes) }); setSubmitted(true); }
    catch (err) { setError(apiErrorMessage(err, 'Unable to save your RSVP. Check the link and try again.')); }
    finally { setLoading(false); }
  };
  return <main className="rsvp-page"><section className="rsvp-card"><p className="eyebrow">EVENT RSVP</p>{submitted ? <div className="rsvp-success"><span>✓</span><h1>Thanks, you’re on the list.</h1><p>Your response has been shared with the host. You can close this page now.</p><button className="secondary-button" onClick={() => { setSubmitted(false); setForm(initial); }}>Update response</button></div> : <><h1>Will you join us?</h1><p className="rsvp-subtitle">Let the host know your plans. It only takes a minute.</p><form className="stack-form" onSubmit={submit}><label>Your name<input required autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} /></label><div className="two-col"><label>Email <span className="optional">or phone</span><input type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></label><label>Phone <span className="optional">or email</span><input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} /></label></div><fieldset><legend>Will you attend?</legend><div className="choice-row">{[['yes', 'Yes, I’ll be there'], ['maybe', 'Maybe'], ['no', 'Can’t make it']].map(([value, label]) => <label className={form.status === value ? 'choice active' : 'choice'} key={value}><input type="radio" name="status" value={value} checked={form.status === value} onChange={(e) => update('status', e.target.value)} />{label}</label>)}</div></fieldset><div className="two-col"><label>Plus ones<input type="number" min="0" max="20" step="1" value={form.plusOnes} onChange={(e) => update('plusOnes', e.target.value)} /></label><label>Dietary needs <span className="optional">optional</span><input value={form.dietaryPreference} onChange={(e) => update('dietaryPreference', e.target.value)} placeholder="Vegetarian, none..." /></label></div>{error && <p className="error" role="alert">{error}</p>}<button className="primary-button wide" disabled={loading}>{loading ? 'Saving response...' : 'Send RSVP'}</button></form></>}</section></main>;
}
