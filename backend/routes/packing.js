import express from 'express';
import { updatePackingItem, deletePackingItem } from '../controllers/packingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.put('/:id', updatePackingItem);
router.delete('/:id', deletePackingItem);

export default router;
