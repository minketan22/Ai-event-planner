import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return <header className="navbar">
    <Link className="brand" to="/">Planwell<span>.</span></Link>
    <nav>
      <Link to="/">My events</Link>
      <Link className="nav-action" to="/events/new">+ New event</Link>
      <span className="user-name">{user?.name}</span>
      <button className="link-button" onClick={() => { logout(); navigate('/login'); }}>Log out</button>
    </nav>
  </header>;
}
