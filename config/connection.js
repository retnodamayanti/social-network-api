const mongoose = require('mongoose');

const connectionString =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialAPI';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dbConnection = mongoose.connection;

dbConnection.once('open', () => {
  console.log('Connected to the database');
});

dbConnection.on('error', (error) => {
  console.error('Error connecting to the database:', error.message);
});

module.exports = dbConnection;
