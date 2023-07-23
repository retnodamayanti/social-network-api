const express = require('express');
const userRoutes = require('./routes/userRoutes');
const thoughtRoutes = require('./routes/thoughtRoutes');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON data
app.use(express.json());

// Import the MongoDB connection from config/connection.js
const dbConnection = require('./config/connection');

// Connect to the MongoDB database using the connection
mongoose.connection.once('open', () => {
  console.log('Connected to the database');
  // Start the server after the database connection is successful
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

// Error handling for database connection
mongoose.connection.on('error', (error) => {
  console.error('Error connecting to the database:', error.message);
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);

// Handle 404 - Page Not Found
app.use((req, res, next) => {
  res.status(404).json({ error: 'Page not found.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Server error.' });
});
