import UrlCard from './UrlCard.jsx';

const UrlList = ({ urls, onDelete }) => {
  return (
    <div>
      {urls.map((url) => (
        <UrlCard key={url._id} url={url} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default UrlList;