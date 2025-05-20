const express = require('express');
const pool = require('../db');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// POST /payment - Insert payment (auto-calculate from services)
router.post('/', isAuthenticated, async (req, res) => {
    const { service_record_id, receiver_id, payment_date } = req.body;
    if (!service_record_id || !receiver_id || !payment_date) {
        return res.status(400).json({ message: 'service_record_id, receiver_id, and payment_date are required' });
    }
    try {
        // Calculate total amount from services linked to service_record_id
        const [services] = await pool.query(
            `SELECT SUM(s.price) as total_price
            FROM service_record_services srs
            JOIN services s ON srs.service_id = s.id
            WHERE srs.service_record_id = ?`,
            [service_record_id]
        );
        const totalAmount = services[0].total_price || 0;
        if (totalAmount === 0) {
            return res.status(400).json({ message: 'No services found for the given service record' });
        }
        const [result] = await pool.query(
            'INSERT INTO payments (service_record_id, amount, receiver_id, payment_date) VALUES (?, ?, ?, ?)',
            [service_record_id, totalAmount, receiver_id, payment_date]
        );
        res.status(201).json({ id: result.insertId, service_record_id, amount: totalAmount, receiver_id, payment_date });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
