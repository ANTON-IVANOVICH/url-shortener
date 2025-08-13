import express from 'express';
import { shortenUrl, getUrlInfo, deleteUrl, getAnalytics } from '../controllers/urlController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validateBody } from '../middlewares/validateBody';
import { shortenSchema } from '../schemas/urlSchemas';

const router = express.Router();

router.post('/shorten', validateBody(shortenSchema), asyncHandler(shortenUrl));
router.get('/info/:shortUrl', asyncHandler(getUrlInfo));
router.delete('/delete/:shortUrl', asyncHandler(deleteUrl));
router.get('/analytics/:shortUrl', asyncHandler(getAnalytics));
// router.get('/:shortUrl', asyncHandler(redirectUrl));

export default router;
