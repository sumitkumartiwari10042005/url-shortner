import Url from '../models/Url.js';
import { generateShortCode } from '../services/shortCode.service.js';
import { getCachedUrl, cacheUrl, deleteCachedUrl } from '../services/cache.service.js';
import { isValidUrl } from '../utils/validateUrl.js';


export const shortenUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ message: 'longUrl is required' });
    }

    if (!isValidUrl(longUrl)) {
      return res.status(400).json({ message: 'Please provide a valid URL' });
    }

   
    if (longUrl.includes(process.env.BASE_URL)) {
      return res.status(400).json({ message: 'Cannot shorten a URL from this domain' });
    }

    const shortCode = await generateShortCode(); 

    const url = await Url.create({
      shortCode,
      longUrl,
      userId: req.user?.id || null, 
    });

    await cacheUrl(shortCode, longUrl);

    res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      longUrl: url.longUrl,
      shortCode: url.shortCode,
      createdAt: url.createdAt,
    });
  } catch (err) {
    console.error('Shorten URL error:', err.message);
    res.status(500).json({ message: 'Something went wrong while shortening the URL' });
  }
};



export const redirectToLongUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

   
    const longUrl = await getCachedUrl(shortCode);

    if (!longUrl) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    
    Url.updateOne({ shortCode }, { $inc: { clicks: 1 } }).catch((err) =>
      console.error('Click increment failed:', err.message)
    );

    res.redirect(302, longUrl); 
  } catch (err) {
    console.error('Redirect error:', err.message);
    res.status(500).json({ message: 'Something went wrong while redirecting' });
  }
};


export const getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(urls);
  } catch (err) {
    console.error('Get user URLs error:', err.message);
    res.status(500).json({ message: 'Something went wrong while fetching your URLs' });
  }
};


export const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await Url.findById(id);
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    if (!url.userId || url.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to delete this URL' });
    }

    await url.deleteOne();
    await deleteCachedUrl(url.shortCode); 

    res.status(200).json({ message: 'URL deleted successfully' });
  } catch (err) {
    console.error('Delete URL error:', err.message);
    res.status(500).json({ message: 'Something went wrong while deleting the URL' });
  }
};