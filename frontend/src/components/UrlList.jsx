import UrlCard from './UrlCard.jsx';

const UrlList = ({ urls, onDelete }) => {
  return (
    <div className="link-table-wrap">
      <table className="link-table">
        <thead>
          <tr>
            <th>Code</th>
            <th className="th-long">Destination</th>
            <th>Clicks</th>
            <th>Created</th>
            <th aria-label="Actions"></th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <UrlCard key={url._id} url={url} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UrlList;
