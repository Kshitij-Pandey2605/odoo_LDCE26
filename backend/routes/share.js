import express from 'express';
import { getSharedTrip, copySharedTrip } from '../controllers/shareController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:token', getSharedTrip);
router.post('/:token/copy', authenticate, copySharedTrip);

export default router;
