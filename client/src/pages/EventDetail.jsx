import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { apiErrorMessage } from '../api';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import BudgetTracker from '../components/BudgetTracker';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guestsLoading, setGuestsLoading] = useState(true);
  const [error, setError] = useState('');
  const [guestError, setGuestError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`).then(({ data }) => {
      setEvent(data);
      if (data.templateId) api.get(`/templates/${data.templateId}`).then(({ data: template }) => setTemplateName(template.name)).catch(() => {});
    }).catch((err) => setError(apiErrorMessage(err, 'Unable to load this event.'))).finally(() => setLoading(false));
    api.get(`/events/${id}/guests`).then(({ data }) => setGuests(data)).catch((err) => setGuestError(apiErrorMessage(err, 'Unable to load guest responses.'))).finally(() => setGuestsLoading(false));
  }, [id]);

  const toggle = async (index) => {
    const previous = event;
    const checklist = event.checklist.map((item, itemIndex) => itemIndex === index ? { ...item, done: !item.done } : item);
    setEvent({ ...event, checklist });
    try { await api.put(`/events/${id}`, eventPayload({ ...event, checklist })); }
    catch (err) { setEvent(previous); setError(apiErrorMessage(err, 'The checklist could not be updated.')); }
  };
  const remove = async () => { if (!window.confirm('Delete this event? This cannot be undone.')) return; try { await api.delete(`/events/${id}`); navigate('/'); } catch (err) { setError(apiErrorMessage(err, 'Unable to delete this event.')); } };
  const copyInvite = async () => { if (!event.publicToken) return setGuestError('This event does not have an RSVP token yet. Refresh the page and try again.'); try { await navigator.clipboard.writeText(`${window.location.origin}/rsvp/${event.publicToken}`); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { setGuestError('Copy failed. You can copy the RSVP URL from your browser address bar.'); } };
  const guestCounts = guests.reduce((counts, guest) => ({ ...counts, [guest.status]: counts[guest.status] + 1 }), { yes: 0, no: 0, maybe: 0 });
  const headcount = guests.reduce((total, guest) => total + (guest.status === 'yes' ? 1 + guest.plusOnes : 0), 0);
  const dietary = guests.filter((guest) => guest.dietaryPreference).reduce((items, guest) => { items[guest.dietaryPreference] = (items[guest.dietaryPreference] || 0) + 1; return items; }, {});

  if (loading) return <><Navbar /><Spinner label="Loading event" /></>;
  if (error && !event) return <><Navbar /><main className="page-shell"><p className="error banner">{error}</p><Link to="/">Back to events</Link></main></>;
  return <><Navbar /><main className="page-shell detail-page">
    <div className="detail-top"><div><Link className="back-link" to="/">← All events</Link><div className="detail-kicker"><p className="eyebrow">EVENT BLUEPRINT</p>{templateName && <span className="template-badge">{templateName}</span>}</div><h1>{event.title}</h1><p className="lead">{event.description}</p></div><button className="danger-button" onClick={remove}>Delete event</button></div>
    {error && <p className="error banner">{error}</p>}
    <div className="detail-stats"><div><span>LOCATION</span><strong>{event.location}</strong></div><div><span>DATE</span><strong>{event.date ? formatDate(event.date) : 'Not set'}</strong></div><div><span>PLANNED GUESTS</span><strong>{event.guestCount}</strong></div><div><span>BUDGET</span><strong>₹{Number(event.budget).toLocaleString('en-IN')}</strong></div></div>
    <div className="invite-bar"><div><strong>Invite guests</strong><span>Share a public RSVP link for this event.</span></div><button className="secondary-button" onClick={copyInvite}>{copied ? 'Copied!' : 'Copy RSVP link'}</button></div>
    <BudgetTracker event={event} />
    <div className="detail-grid"><section className="content-panel"><h2>Agenda</h2>{event.agenda?.map((item, index) => <div className="agenda-row" key={`${item.time}-${index}`}><strong>{item.time}</strong><span>{item.activity}</span></div>)}</section>
      <section className="content-panel"><h2>Checklist <small>{event.checklist?.filter((item) => item.done).length}/{event.checklist?.length}</small></h2><div className="checklist">{event.checklist?.map((item, index) => <label className={item.done ? 'check-row done' : 'check-row'} key={`${item.task}-${index}`}><input type="checkbox" checked={Boolean(item.done)} onChange={() => toggle(index)} /><span>{item.task}</span></label>)}</div></section>
      <section className="content-panel budget-panel"><h2>Budget split</h2>{event.budgetSplit?.map((item) => <div className="budget-row" key={item.category}><span>{item.category}</span><strong>₹{Number(item.amount).toLocaleString('en-IN')}</strong></div>)}</section>
      <section className="content-panel guests-panel"><div className="section-heading"><div><p className="eyebrow">RESPONSES</p><h2>Guest list</h2></div><strong className="headcount">{headcount} attending</strong></div>{guestError && <p className="error banner">{guestError}</p>}{guestsLoading ? <Spinner label="Loading guest responses" /> : <><div className="guest-stats"><div><strong>{guestCounts.yes}</strong><span>Attending</span></div><div><strong>{guestCounts.maybe}</strong><span>Maybe</span></div><div><strong>{guestCounts.no}</strong><span>Not attending</span></div><div><strong>{guests.length}</strong><span>Responses</span></div></div><div className="dietary-list"><strong>Dietary notes</strong>{Object.entries(dietary).length ? Object.entries(dietary).map(([name, count]) => <span key={name}>{name} · {count}</span>) : <span>No dietary notes yet</span>}</div>{guests.length ? guests.map((guest) => <div className="guest-row" key={guest._id}><div><strong>{guest.name}</strong><span>{guest.email || guest.phone || 'No contact'}{guest.plusOnes ? ` · +${guest.plusOnes}` : ''}</span></div><span className={`status status-${guest.status}`}>{guest.status}</span></div>) : <p className="muted">No responses yet. Share the RSVP link to get started.</p>}</>}</section>
    </div>
  </main></>;
}

function formatDate(value) { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value)); }
function eventPayload(event) { return { title: event.title, description: event.description, date: event.date, location: event.location, budget: event.budget, guestCount: event.guestCount, templateId: event.templateId, agenda: event.agenda, checklist: event.checklist, budgetSplit: event.budgetSplit }; }
