import { useState } from 'react';

// Renders one table row. Kept named UrlCard so existing imports don't change.
const UrlCard = ({ url, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const shortUrl = `${import.meta.env.VITE_API_URL}/${url.shortCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — nothing useful to show, user can select the code manually
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(url._id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <tr>
      <td className="td-code">
        <a href={shortUrl} target="_blank" rel="noopener noreferrer">
          /{url.shortCode}
        </a>
      </td>
      <td className="td-long" title={url.longUrl}>{url.longUrl}</td>
      <td className="td-clicks">{url.clicks ?? 0}</td>
      <td className="td-date">{new Date(url.createdAt).toLocaleDateString()}</td>
      <td>
        <div className="td-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
          {onDelete && (
            <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting' : 'Delete'}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UrlCard;
