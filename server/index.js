import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Restrict CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  // Add production domain here later
];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // allow cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Serve frontend dist if built
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api', routes);

// Fallback for SPA Routing
app.get('*', (req, res) => {
  const distIndex = path.join(__dirname, '../dist/index.html');
  if (req.accepts('html') && !req.path.startsWith('/api')) {
    res.sendFile(distIndex, (err) => {
      if (err) {
        res.status(200).send('BC Creative Spectrum Server Running. Front-end is served via Vite Dev server.');
      }
    });
  } else {
    res.status(404).json({ error: 'Endpoint not found' });
  }
});

// Global Error Handler (Don't leak stack traces in prod)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  // Log full trace in console, but don't send to client
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`BC Creative Spectrum Server listening on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
    console.log(`================================================`);
  });
}

export default app;
