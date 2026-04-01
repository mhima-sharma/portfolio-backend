import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:4200')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const vercelPreviewPattern = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;

const isAllowedOrigin = origin => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  if (origin === 'http://localhost:4200' || origin === 'http://127.0.0.1:4200') {
    return true;
  }

  if (vercelPreviewPattern.test(origin)) {
    return true;
  }

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests and tools like curl/Postman without an Origin header.
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// Middleware
app.use((req, res, next) => {
  if (req.headers.origin) {
    console.log(`Incoming origin: ${req.headers.origin}`);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Health Check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio backend is running',
    data: {
      health: '/health',
      auth: '/api/auth/login',
      portfolio: '/api/portfolio',
      about: '/api/about',
      contact: '/api/contact',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', portfolioRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
});

export default app;
