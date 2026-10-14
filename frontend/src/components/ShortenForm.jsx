import { useState } from 'react';
import api from '../services/api.js';

const ShortenForm = ({ onNewUrl, autoFocus = false }) => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCopied(false);

    if (!longUrl.trim()) {
      setError('Enter a URL to shorten.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/shorten', { longUrl });
      setShortUrl(data.shortUrl);
      setLongUrl('');
      if (onNewUrl) onNewUrl(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not shorten that URL. Check it starts with http:// or https:// and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Copy was blocked by the browser. Select the link and copy it manually.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="shorten-form">
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="https://example.com/a/very/long/path"
          disabled={loading}
          autoFocus={autoFocus}
          aria-label="URL to shorten"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Shortening' : 'Shorten'}
        </button>
      </form>

      {error && <p className="state-error" role="alert">{error}</p>}

      {shortUrl && !onNewUrl && (
        <div className="result-row">
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
          <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShortenForm;
