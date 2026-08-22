import express from 'express';
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip, duplicateTrip, shareTrip } from '../controllers/tripController.js';
import { addStop, reorderStops } from '../controllers/tripStopController.js';
import { getExpenses, addExpense } from '../controllers/expenseController.js';
import { getPackingItems, addPackingItem } from '../controllers/packingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate); // Secure all trip routes

router.get('/', getTrips);
router.post('/', createTrip);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/duplicate', duplicateTrip);
router.post('/:id/share', shareTrip);
router.post('/:tripId/stops', addStop);
router.put('/:tripId/reorder', reorderStops);
router.get('/:tripId/expenses', getExpenses);
router.post('/:tripId/expenses', addExpense);
router.get('/:tripId/packing', getPackingItems);
router.post('/:tripId/packing', addPackingItem);

export default router;
