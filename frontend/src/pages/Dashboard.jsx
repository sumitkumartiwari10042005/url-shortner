import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ShortenForm from '../components/ShortenForm.jsx';
import UrlList from '../components/UrlList.jsx';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  
    if (authLoading) return;

    const fetchUrls = async () => {
      try {
        const { data } = await api.get('/api/urls');
        setUrls(data);
      } catch (err) {
        setError('Could not load your URLs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [authLoading]);

  
  const handleNewUrl = (newUrl) => {
    setUrls((prev) => [
      { ...newUrl, _id: newUrl.shortCode, clicks: 0 }, 
      ...prev,
    ]);
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/urls/${id}`);
    setUrls((prev) => prev.filter((url) => url._id !== id));
  };

  if (authLoading || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Your Dashboard</h1>

      <ShortenForm onNewUrl={handleNewUrl} />

      {error && <p role="alert">{error}</p>}

      {urls.length === 0 ? (
        <p>You haven't shortened any URLs yet.</p>
      ) : (
        <UrlList urls={urls} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Dashboard;