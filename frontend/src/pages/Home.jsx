import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ShortenForm from '../components/ShortenForm.jsx';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="page">
      <section className="hero">
        <h1>Paste a long URL. Get a short one.</h1>
        <p>No account needed. Sign in if you want a list of your links to manage and delete later.</p>

        <ShortenForm autoFocus />

        <p className="hero-footnote">
          {isAuthenticated ? (
            <>Your saved links are in <Link to="/dashboard">Links</Link>.</>
          ) : (
            <><Link to="/register">Create an account</Link> to keep track of what you've shortened.</>
          )}
        </p>
      </section>
    </main>
  );
};

export default Home;
