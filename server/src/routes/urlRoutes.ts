import express from 'express';
import { shortenUrl, redirectUrl, getUrlInfo, deleteUrl, getAnalytics } from '../controllers/urlController';

const router = express.Router();

router.post('/shorten', shortenUrl);

router.get('/:shortUrl', redirectUrl);

router.get('/info/:shortUrl', getUrlInfo);

router.delete('/delete/:shortUrl', deleteUrl);

router.get('/analytics/:shortUrl', getAnalytics);

export default router;
