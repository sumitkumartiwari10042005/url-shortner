import { useState } from 'react';

const UrlCard = ({ url, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const shortUrl = `${import.meta.env.VITE_API_URL}/${url.shortCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
     
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete(url._id);
    
    } catch {
      setDeleting(false); 
    }
  };

  
  const displayLongUrl =
    url.longUrl.length > 60 ? `${url.longUrl.slice(0, 60)}...` : url.longUrl;

  return (
    <div>
      <a href={shortUrl} target="_blank" rel="noopener noreferrer">
        {shortUrl}
      </a>

      <p title={url.longUrl}>{displayLongUrl}</p>

      <div>
        <span>{url.clicks ?? 0} clicks</span>
        <span>{new Date(url.createdAt).toLocaleDateString()}</span>
      </div>

      <div>
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>
        {onDelete && (
          <button onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UrlCard;