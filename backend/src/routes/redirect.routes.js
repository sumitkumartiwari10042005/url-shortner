import express from 'express';
import { redirectToLongUrl } from '../controllers/url.controller.js';
 
const router = express.Router();
 

router.get('/:shortCode', redirectToLongUrl);
 
export default router;