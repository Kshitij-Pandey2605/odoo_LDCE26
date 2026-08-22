import express from 'express';
import { updateStop, deleteStop } from '../controllers/tripStopController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.put('/:id', updateStop);
router.delete('/:id', deleteStop);

export default router;
