const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'RealWorld Conduit API',
    description: 'Test Harness SUT for Software Testing & CI/CD Seminar',
    version: '1.0.0',
    documentation: 'https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction'
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ errors: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
