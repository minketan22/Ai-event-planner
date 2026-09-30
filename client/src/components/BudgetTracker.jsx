import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api, { apiErrorMessage } from '../api';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const emptyForm = { category: '', customCategory: '', amount: '', description: '', paidTo: '', date: new Date().toISOString().slice(0, 10) };

export default function BudgetTracker({ event }) {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState(event.expenses || []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadSummary = async () => {
    try {
      const [{ data: nextSummary }, { data: nextEvent }] = await Promise.all([api.get(`/events/${event._id}/budget-summary`), api.get(`/events/${event._id}`)]);
      setSummary(nextSummary);
      setExpenses(nextEvent.expenses || []);
    } catch (err) { setError(apiErrorMessage(err, 'Unable to load budget data.')); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadSummary(); }, [event._id]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const resetForm = () => { setForm(emptyForm); setEditingId(''); };
  const submit = async (submitEvent) => {
    submitEvent.preventDefault();
    const category = form.category === '__other' ? form.customCategory.trim() : form.category.trim();
    if (!category) return setError('Choose or enter an expense category.');
    if (!Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) return setError('Expense amount must be greater than zero.');
    setSaving(true); setError('');
    const payload = { category, amount: Number(form.amount), description: form.description.trim(), paidTo: form.paidTo.trim(), date: form.date || undefined };
    try {
      if (editingId) await api.put(`/events/${event._id}/expenses/${editingId}`, payload);
      else await api.post(`/events/${event._id}/expenses`, payload);
      resetForm();
      await loadSummary();
    } catch (err) { setError(apiErrorMessage(err, 'Unable to save this expense.')); }
    finally { setSaving(false); }
  };
  const edit = (expense) => { const planned = event.budgetSplit?.some((item) => item.category.toLowerCase() === expense.category.toLowerCase()); setEditingId(expense._id); setForm({ category: planned ? expense.category : '__other', customCategory: planned ? '' : expense.category, amount: expense.amount, description: expense.description || '', paidTo: expense.paidTo || '', date: expense.date ? expense.date.slice(0, 10) : '' }); setError(''); };
  const remove = async (expenseId) => { if (!window.confirm('Delete this expense?')) return; setError(''); try { await api.delete(`/events/${event._id}/expenses/${expenseId}`); await loadSummary(); } catch (err) { setError(apiErrorMessage(err, 'Unable to delete this expense.')); } };

  if (loading) return <section className="content-panel budget-tracker"><p className="muted">Loading budget tracker...</p></section>;
  if (!summary) return <section className="content-panel budget-tracker"><p className="error" role="alert">{error || 'Budget summary is unavailable.'}</p></section>;
  const chartData = summary.categories.map((category) => ({ category: category.category.length > 18 ? `${category.category.slice(0, 18)}…` : category.category, planned: category.planned, actual: category.spent }));
  const warningCategories = summary.categories.filter((category) => category.status === 'warning');
  const overCategories = summary.categories.filter((category) => category.status === 'over');
  const overallMessage = summary.status === 'over' ? `Over budget by ${money.format(Math.abs(summary.remaining))}` : summary.status === 'warning' ? `Warning: ${summary.percentUsed}% used` : '';
  return <section className="content-panel budget-tracker">
    <div className="section-heading"><div><p className="eyebrow">BUDGET TRACKER</p><h2>Planned vs actual</h2></div><span className={`budget-status status-${summary.status}`}>{summary.status}</span></div>
    {overallMessage && <p className={summary.status === 'over' ? 'budget-alert over' : 'budget-alert warning'} role="status">{summary.status === 'over' ? '⚠' : '!' } {overallMessage}</p>}
    {overCategories.map((category) => <p className="budget-alert over" role="status" key={`over-${category.category}`}>⚠ Over budget in {category.category} by {money.format(Math.abs(category.remaining))}</p>)}
    {!overallMessage && warningCategories.map((category) => <p className="budget-alert warning" role="status" key={`warning-${category.category}`}>! Warning: {category.category} is {category.percentUsed}% used</p>)}
    <div className="budget-summary-cards"><div><span>Total budget</span><strong>{money.format(summary.totalBudget)}</strong></div><div><span>Spent</span><strong>{money.format(summary.totalSpent)}</strong></div><div><span>Remaining</span><strong>{money.format(summary.remaining)}</strong></div></div>
    <div className="budget-progress" aria-label={`${summary.percentUsed}% of budget used`}><span style={{ width: `${Math.min(summary.percentUsed, 100)}%` }} /></div><p className="budget-progress-label">{summary.percentUsed}% used of {money.format(summary.totalBudget)} <span>{summary.status}</span></p>
    <div className="budget-categories">{summary.categories.map((category) => <div className="budget-category" key={category.category}><div className="budget-category-heading"><strong>{category.category}</strong><span className={`budget-status status-${category.status}`}>{category.status === 'unplanned' ? 'Unplanned' : category.status}</span></div><div className="budget-progress small"><span style={{ width: `${Math.min(category.percentUsed, 100)}%` }} /></div><div className="budget-category-meta"><span>{money.format(category.spent)} of {money.format(category.planned)}</span><span>{category.status === 'unplanned' ? 'No planned amount' : `${category.percentUsed}% used`}</span></div></div>)}</div>
    <div className="budget-chart"><h3>Category comparison</h3><ResponsiveContainer width="100%" height={270}><BarChart data={chartData} margin={{ top: 5, right: 10, left: 8, bottom: 45 }}><CartesianGrid strokeDasharray="3 3" stroke="#e8e1d6" /><XAxis dataKey="category" angle={-25} textAnchor="end" interval={0} height={65} tick={{ fill: '#68736a', fontSize: 11 }} /><YAxis tick={{ fill: '#68736a', fontSize: 11 }} tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} /><Tooltip formatter={(value) => money.format(value)} /><Legend /><Bar dataKey="planned" name="Planned" fill="#9fb4a2" radius={[3, 3, 0, 0]} /><Bar dataKey="actual" name="Actual" fill="#d86c45" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div>
    <div className="expense-section"><div className="section-heading"><div><h3>{editingId ? 'Edit expense' : 'Add expense'}</h3><p className="muted">Record payments as they happen.</p></div>{editingId && <button type="button" className="secondary-button" onClick={resetForm}>Cancel edit</button>}</div><form className="expense-form" onSubmit={submit}><label>Category<select value={form.category} onChange={(e) => update('category', e.target.value)}><option value="">Choose a category</option>{event.budgetSplit?.map((item) => <option key={item.category} value={item.category}>{item.category}</option>)}<option value="__other">Other</option></select></label>{form.category === '__other' && <label>Other category<input value={form.customCategory} onChange={(e) => update('customCategory', e.target.value)} placeholder=" e.g. permits" /></label>}<label>Amount (INR)<input required type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => update('amount', e.target.value)} /></label><label>Description<input value={form.description} onChange={(e) => update('description', e.target.value)} /></label><label>Paid to<input value={form.paidTo} onChange={(e) => update('paidTo', e.target.value)} /></label><label>Date<input required type="date" value={form.date} onChange={(e) => update('date', e.target.value)} /></label>{error && <p className="error" role="alert">{error}</p>}<button className="primary-button" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update expense' : 'Add expense'}</button></form></div>
    <div className="expense-list"><h3>Expenses</h3>{expenses.length ? expenses.map((expense) => <div className="expense-row" key={expense._id}><div><strong>{expense.category}</strong><span>{expense.description || 'No description'}{expense.paidTo ? ` · ${expense.paidTo}` : ''} · {expense.date ? new Date(expense.date).toLocaleDateString('en-IN') : 'No date'}</span></div><strong>{money.format(expense.amount)}</strong><div className="expense-actions"><button type="button" className="link-button" onClick={() => edit(expense)}>Edit</button><button type="button" className="link-button danger-link" onClick={() => remove(expense._id)}>Delete</button></div></div>) : <p className="muted">No expenses recorded yet.</p>}</div>
  </section>;
}
