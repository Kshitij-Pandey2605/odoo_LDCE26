import express from 'express';
import { updateProfile, deleteAccount } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.put('/', updateProfile);
router.delete('/', deleteAccount);

export default router;
