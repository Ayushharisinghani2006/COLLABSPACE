const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Should match auth.js
const meetingRoutes = require('./routes/meetings');

const app = express();

// Enable CORS for the frontend origin
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/v1/auth', authRoutes);
app.use('/v1/meetings', meetingRoutes);

module.exports = app;