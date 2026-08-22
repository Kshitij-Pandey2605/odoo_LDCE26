import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import stopRoutes from './routes/stops.js';
import cityRoutes from './routes/cities.js';
import activityRoutes from './routes/activities.js';
import tripActivityRoutes from './routes/tripActivities.js';
import expenseRoutes from './routes/expenses.js';
import shareRoutes from './routes/share.js';
import profileRoutes from './routes/profile.js';
import savedDestinationsRoutes from './routes/savedDestinations.js';
import packingRoutes from './routes/packing.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // We can restrict this in production
  credentials: true,
}));
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/trip-activities', tripActivityRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/saved-destinations', savedDestinationsRoutes);
app.use('/api/packing', packingRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GlobeTrotter API Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
  console.log(`GlobeTrotter Server running on port ${PORT}`);
});
