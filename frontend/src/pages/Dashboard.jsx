import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ShortenForm from '../components/ShortenForm.jsx';
import UrlList from '../components/UrlList.jsx';

const Dashboard = () => {
  const { loading: authLoading } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;

    const fetchUrls = async () => {
      try {
        const { data } = await api.get('/api/urls');
        setUrls(data);
      } catch {
        setError('Could not load your links. Refresh the page to try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [authLoading]);

  const handleNewUrl = (newUrl) => {
    setUrls((prev) => {
      const existing = prev.find((url) => url._id === newUrl._id);
      if (existing) {
        const rest = prev.filter((url) => url._id !== newUrl._id);
        return [{ ...newUrl, clicks: existing.clicks }, ...rest];
      }
      return [{ ...newUrl, clicks: 0 }, ...prev];
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/urls/${id}`);
    setUrls((prev) => prev.filter((url) => url._id !== id));
  };

  return (
    <main className="page">
      <h1>Links</h1>

      <ShortenForm onNewUrl={handleNewUrl} autoFocus />

      {(authLoading || loading) && <p className="state-loading">Loading…</p>}

      {!authLoading && !loading && error && <p className="state-error" role="alert">{error}</p>}

      {!authLoading && !loading && !error && urls.length === 0 && (
        <div className="state-empty">
          No links yet. Paste a URL above and it will show up here with its click count.
        </div>
      )}

      {!authLoading && !loading && urls.length > 0 && (
        <UrlList urls={urls} onDelete={handleDelete} />
      )}
    </main>
  );
};

export default Dashboard;
