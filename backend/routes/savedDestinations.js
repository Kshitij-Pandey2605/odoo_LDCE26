import express from 'express';
import { saveDestination, getSavedDestinations, unsaveDestination } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', saveDestination);
router.get('/', getSavedDestinations);
router.delete('/:id', unsaveDestination);

export default router;
