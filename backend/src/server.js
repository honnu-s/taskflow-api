require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use('/api/', limiter);

// Swagger Docs
try {
  const swaggerDocument = YAML.load('./docs/swagger.yaml');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.log('Swagger docs not loaded:', e.message);
}

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/tasks', require('./routes/task.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
