import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import NewEvent from './pages/NewEvent';
import Register from './pages/Register';
import RSVP from './pages/RSVP';

export default function App() {
  return <Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/rsvp/:token" element={<RSVP />} /><Route element={<ProtectedRoute />}><Route path="/" element={<Dashboard />} /><Route path="/events/new" element={<NewEvent />} /><Route path="/events/:id" element={<EventDetail />} /></Route></Routes>;
}
