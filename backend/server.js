import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

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

// Security & Rate Limiting Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Restrict in production
  credentials: true,
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

app.use(express.json());

// Swagger API Documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
  res.json({
    status: 'ok',
    message: 'GlobeTrotter API Server is running',
    timestamp: new Date().toISOString(),
    swagger: '/api-docs',
  });
});

// Centralized Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server!',
    errors: err.errors || [],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 GlobeTrotter Server running on port ${PORT}`);
  console.log(`📚 Swagger Documentation UI: http://localhost:${PORT}/api-docs`);
});
