import express from 'express';
import { updateExpense, deleteExpense } from '../controllers/expenseController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
