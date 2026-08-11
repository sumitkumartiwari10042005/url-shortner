import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ShortenForm from '../components/ShortenForm.jsx';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h1>URL Shortener</h1>
      <p>Paste a long link, get a short one — no login required.</p>

      <ShortenForm />

      {isAuthenticated ? (
        <p>
          Want to see all your links? <Link to="/dashboard">Go to your dashboard</Link>
        </p>
      ) : (
        <p>
          <Link to="/login">Log in</Link> to save and manage your shortened links.
        </p>
      )}
    </div>
  );
};

export default Home;