import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cvExtractRouter from './routes/extractTextFromCv.js';
import roadmapRouter from './routes/roadmap.js';
import stripeRouter from './routes/stripe.js';
import processCvRouter from './routes/processCv.js';
import InterviewPrepRouter from './routes/interviewPrep.js';
import cvAnalysisCore from './controllers/cvAnalysisCore.js';
import cvAnalysisJob from './controllers/cvAnalysisJob.js';
import youtubeVideos from './routes/youtubeApi.js';
import googleBooks from './routes/googleBook.js';
import './firebase.js'; // Initialize Firebase

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL, // Production frontend URL
  'https://career-roadmap-3.vercel.app',
  'http://localhost:5173', // Vite dev server
  'http://127.0.0.1:5173', // Alternative localhost
  'http://localhost:3000', // Create-react-app default
];

// Enhanced CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches HTTPS version
      const isAllowed = allowedOrigins.some(function (allowedOrigin) {
        return (
          origin === allowedOrigin ||
          origin.startsWith(allowedOrigin.replace('http://', 'https://'))
        );
      });

      if (isAllowed) {
        return callback(null, true);
      }

      const msg = `The CORS policy for this site does not allow access from ${origin}`;
      return callback(new Error(msg), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Stripe webhook route must come before body parsers!
app.use('/api/stripe/webhook', stripeRouter);

// Other middleware
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true,
    createParentPath: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(function (req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/roadmap', roadmapRouter);
app.use('/api/interviewPrep', InterviewPrepRouter);
app.use('/api/processCv', processCvRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/extract-cv', cvExtractRouter);
app.use('/api/analyze', cvAnalysisCore);
app.use('/api/compare', cvAnalysisJob);
app.use('/api/youtube', youtubeVideos);
app.use('/api/google', googleBooks);

// Health check endpoint
app.get('/health', function (req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    allowedOrigins: allowedOrigins,
  });
});

// 404 Handler
app.use(function (req, res) {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested resource ${req.originalUrl} was not found`,
  });
});

// Error Handler
app.use(function (err, req, res, next) {
  console.error(`[ERROR] ${err.stack}`);

  // Handle CORS errors specifically
  if (err.message.includes('CORS policy')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: err.message,
      allowedOrigins: allowedOrigins,
    });
  }

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong!'
      : err.message;

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
});

// Start server
const server = app.listen(PORT, function () {
  console.log(`
  🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
  🔗 Base URL: http://localhost:${PORT}
  🌐 Allowed Origins: ${allowedOrigins.join(', ')}
  📚 API Docs: http://localhost:${PORT}/api-docs
  🩺 Health Check: http://localhost:${PORT}/health
  `);
});

// Handle shutdowns gracefully
process.on('unhandledRejection', function (err) {
  console.error(`Unhandled Rejection: ${err.stack}`);
  server.close(function () {
    process.exit(1);
  });
});

process.on('SIGTERM', function () {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(function () {
    console.log('Process terminated');
  });
});
