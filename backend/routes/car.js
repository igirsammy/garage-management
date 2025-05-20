const express = require('express');
const pool = require('../db');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// POST /car - Insert car
router.post('/', isAuthenticated, async (req, res) => {
    const { make, model, year, owner_name } = req.body;
    if (!make || !model || !year || !owner_name) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO cars (make, model, year, owner_name) VALUES (?, ?, ?, ?)',
            [make, model, year, owner_name]
        );
        res.status(201).json({ id: result.insertId, make, model, year, owner_name });
    } catch (err) {
        console.error('Error inserting car:', err.stack || err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /car - List all cars
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cars');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching cars:', err.stack || err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
