const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const { isAuthenticated } = require('./middleware/auth');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set true if using https
}));

// Import routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car');
const servicesRoutes = require('./routes/services');
const serviceRecordRoutes = require('./routes/serviceRecord');
const paymentRoutes = require('./routes/payment');
const reportRoutes = require('./routes/report');

// Routes
app.use('/', authRoutes);
app.use('/car', carRoutes);
app.use('/services', servicesRoutes);
app.use('/servicerecord', serviceRecordRoutes);
app.use('/payment', paymentRoutes);
app.use('/report', reportRoutes);

app.get('/', (req, res) => {
    res.send('Garage Management API');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, pool, isAuthenticated };
