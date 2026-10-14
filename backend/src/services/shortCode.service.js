import crypto from 'crypto';
import Url from '../models/Url.js';

const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const CODE_LENGTH = 7; 
const generateRandomCode = () => {
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += BASE62_CHARS[bytes[i] % 62];
  }
  return code;
};


export const generateShortCode = async () => {
  const MAX_ATTEMPTS = 5;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = generateRandomCode();

    const existing = await Url.findOne({ shortCode: code }).lean();
    if (!existing) {
      return code; 
    }
 
  }

  throw new Error('Failed to generate a unique short code after multiple attempts');
};