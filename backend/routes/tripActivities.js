import express from 'express';
import { scheduleActivity, updateScheduledActivity, deleteScheduledActivity } from '../controllers/activityController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', scheduleActivity);
router.put('/:id', updateScheduledActivity);
router.delete('/:id', deleteScheduledActivity);

export default router;
