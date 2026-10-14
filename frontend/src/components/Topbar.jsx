import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Topbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-mark">/</span>shrink
      </Link>

      <nav className="topbar-right">
        {isAuthenticated ? (
          <>
            {user?.email && <span>{user.email}</span>}
            <Link to="/dashboard">Links</Link>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', color: '#fff' }}>
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Topbar;
