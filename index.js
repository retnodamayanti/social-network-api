const express = require('express');
const userRoutes = require('./routes/userRoutes');
const thoughtRoutes = require('./routes/thoughtRoutes');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware 
app.use(express.json());

const dbConnection = require('./config/connection');

mongoose.connection.once('open', () => {
  console.log('Connected to the database');
  // Start the server after the database connection is successful
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

mongoose.connection.on('error', (error) => {
  console.error('Error connecting to the database:', error.message);
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Page not found.' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Server error.' });
});
