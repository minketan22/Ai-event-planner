import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import { apiErrorMessage } from '../api';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/events').then(({ data }) => setEvents(data)).catch((err) => setError(apiErrorMessage(err, 'Unable to load your events.'))).finally(() => setLoading(false)); }, []);
  const remove = async (id) => { if (!window.confirm('Delete this event? This cannot be undone.')) return; try { await api.delete(`/events/${id}`); setEvents((current) => current.filter((event) => event._id !== id)); } catch (err) { setError(apiErrorMessage(err, 'Unable to delete this event.')); } };
  return <><Navbar /><main className="page-shell dashboard"><div className="page-heading"><div><p className="eyebrow">YOUR CALENDAR</p><h1>My events</h1><p>Keep every detail in one calm, useful place.</p></div><Link className="primary-button" to="/events/new">+ Plan an event</Link></div>{loading && <Spinner label="Loading events" />}{error && <p className="error banner">{error}</p>}{!loading && !events.length && <section className="empty-state"><span className="empty-mark">+</span><h2>Your calendar is wide open.</h2><p>Start with a few details and let AI shape the plan.</p><Link className="primary-button" to="/events/new">Create your first event</Link></section>}<div className="event-grid">{events.map((event) => <article className="event-card" key={event._id}><div className="card-top"><span className="event-tag">{event.location}</span><button className="icon-button" title="Delete event" onClick={() => remove(event._id)}>×</button></div><Link to={`/events/${event._id}`}><h2>{event.title}</h2></Link><p>{event.description}</p><div className="card-meta"><span>{event.guestCount} guests</span><span>₹{Number(event.budget).toLocaleString('en-IN')}</span></div></article>)}</div></main></>;
}
