const express = require('express');
const pool = require('../db');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Helper function to format date safely
function formatDate(date) {
    if (!date) return 'Unknown Date';
    if (typeof date === 'string') return date.split('T')[0];
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return 'Unknown Date';
}

// GET /report/daily - Return daily services + amounts
router.get('/daily', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT sr.service_date, c.make, c.model, c.year, c.owner_name,
                s.name as service_name, s.price, p.amount, u.username as receiver
            FROM service_records sr
            JOIN cars c ON sr.car_id = c.id
            JOIN service_record_services srs ON sr.id = srs.service_record_id
            JOIN services s ON srs.service_id = s.id
            LEFT JOIN payments p ON sr.id = p.service_record_id
            LEFT JOIN users u ON p.receiver_id = u.id
            ORDER BY sr.service_date DESC`
        );
        // Group by service_date and car
        const report = {};
        rows.forEach(row => {
            const date = formatDate(row.service_date);
            if (!report[date]) report[date] = [];
            let carEntry = report[date].find(e => e.make === row.make && e.model === row.model && e.owner_name === row.owner_name);
            if (!carEntry) {
                carEntry = {
                    make: row.make,
                    model: row.model,
                    year: row.year,
                    owner_name: row.owner_name,
                    services: [],
                    amount_paid: 0,
                    receiver: row.receiver || null
                };
                report[date].push(carEntry);
            }
            carEntry.services.push({ name: row.service_name, price: row.price });
            carEntry.amount_paid = row.amount || carEntry.amount_paid;
        });
        res.json(report);
    } catch (err) {
        console.error('Error in /report/daily:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /report/weekly - Return weekly aggregated report
router.get('/weekly', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT YEAR(sr.service_date) AS year, WEEK(sr.service_date, 1) AS week,
                c.make, c.model, c.year AS car_year, c.owner_name,
                GROUP_CONCAT(s.name) AS service_names,
                SUM(s.price) AS total_price,
                SUM(p.amount) AS amount_paid,
                u.username AS receiver
            FROM service_records sr
            JOIN cars c ON sr.car_id = c.id
            JOIN service_record_services srs ON sr.id = srs.service_record_id
            JOIN services s ON srs.service_id = s.id
            LEFT JOIN payments p ON sr.id = p.service_record_id
            LEFT JOIN users u ON p.receiver_id = u.id
            GROUP BY year, week, c.id, u.id
            ORDER BY year DESC, week DESC`
        );
        // Group by year-week and car
        const report = {};
        rows.forEach(row => {
            const weekKey = `${row.year}-W${row.week}`;
            if (!report[weekKey]) report[weekKey] = [];
            let carEntry = report[weekKey].find(e => e.make === row.make && e.model === row.model && e.owner_name === row.owner_name);
            if (!carEntry) {
                carEntry = {
                    make: row.make,
                    model: row.model,
                    year: row.car_year,
                    owner_name: row.owner_name,
                    services: row.service_names ? row.service_names.split(',').map(name => ({ name })) : [],
                    amount_paid: row.amount_paid || 0,
                    receiver: row.receiver || null,
                    total_price: row.total_price || 0
                };
                report[weekKey].push(carEntry);
            }
        });
        res.json(report);
    } catch (err) {
        console.error('Error in /report/weekly:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /report/monthly - Return monthly aggregated report
router.get('/monthly', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT YEAR(sr.service_date) AS year, MONTH(sr.service_date) AS month,
                c.make, c.model, c.year AS car_year, c.owner_name,
                GROUP_CONCAT(s.name) AS service_names,
                SUM(s.price) AS total_price,
                SUM(p.amount) AS amount_paid,
                u.username AS receiver
            FROM service_records sr
            JOIN cars c ON sr.car_id = c.id
            JOIN service_record_services srs ON sr.id = srs.service_record_id
            JOIN services s ON srs.service_id = s.id
            LEFT JOIN payments p ON sr.id = p.service_record_id
            LEFT JOIN users u ON p.receiver_id = u.id
            GROUP BY year, month, c.id, u.id
            ORDER BY year DESC, month DESC`
        );
        // Group by year-month and car
        const report = {};
        rows.forEach(row => {
            const monthKey = `${row.year}-${row.month.toString().padStart(2, '0')}`;
            if (!report[monthKey]) report[monthKey] = [];
            let carEntry = report[monthKey].find(e => e.make === row.make && e.model === row.model && e.owner_name === row.owner_name);
            if (!carEntry) {
                carEntry = {
                    make: row.make,
                    model: row.model,
                    year: row.car_year,
                    owner_name: row.owner_name,
                    services: row.service_names ? row.service_names.split(',').map(name => ({ name })) : [],
                    amount_paid: row.amount_paid || 0,
                    receiver: row.receiver || null,
                    total_price: row.total_price || 0
                };
                report[monthKey].push(carEntry);
            }
        });
        res.json(report);
    } catch (err) {
        console.error('Error in /report/monthly:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
