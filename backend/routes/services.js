const express = require('express');
const pool = require('../db');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// POST /services - Insert service
router.post('/', isAuthenticated, async (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO services (name, price) VALUES (?, ?)',
            [name, price]
        );
        res.status(201).json({ id: result.insertId, name, price });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /services - List all services
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM services');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
