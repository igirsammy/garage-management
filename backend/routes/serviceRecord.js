const express = require('express');
const pool = require('../db');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// POST /servicerecord - Insert service record
router.post('/', isAuthenticated, async (req, res) => {
    const { car_id, service_ids, service_date } = req.body;
    if (!car_id || !service_ids || !Array.isArray(service_ids) || service_ids.length === 0 || !service_date) {
        return res.status(400).json({ message: 'car_id, service_ids (non-empty array), and service_date are required' });
    }
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.query(
            'INSERT INTO service_records (car_id, service_date) VALUES (?, ?)',
            [car_id, service_date]
        );
        const serviceRecordId = result.insertId;
        const serviceRecordServicesData = service_ids.map(service_id => [serviceRecordId, service_id]);
        await connection.query(
            'INSERT INTO service_record_services (service_record_id, service_id) VALUES ?',
            [serviceRecordServicesData]
        );
        await connection.commit();
        res.status(201).json({ id: serviceRecordId, car_id, service_ids, service_date });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

// PUT /servicerecord/:id - Update service record
router.put('/:id', isAuthenticated, async (req, res) => {
    const serviceRecordId = req.params.id;
    const { car_id, service_ids, service_date } = req.body;
    if (!car_id || !service_ids || !Array.isArray(service_ids) || service_ids.length === 0 || !service_date) {
        return res.status(400).json({ message: 'car_id, service_ids (non-empty array), and service_date are required' });
    }
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(
            'UPDATE service_records SET car_id = ?, service_date = ? WHERE id = ?',
            [car_id, service_date, serviceRecordId]
        );
        await connection.query(
            'DELETE FROM service_record_services WHERE service_record_id = ?',
            [serviceRecordId]
        );
        const serviceRecordServicesData = service_ids.map(service_id => [serviceRecordId, service_id]);
        await connection.query(
            'INSERT INTO service_record_services (service_record_id, service_id) VALUES ?',
            [serviceRecordServicesData]
        );
        await connection.commit();
        res.json({ id: serviceRecordId, car_id, service_ids, service_date });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

// DELETE /servicerecord/:id - Delete service record
router.delete('/:id', isAuthenticated, async (req, res) => {
    const serviceRecordId = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM service_records WHERE id = ?', [serviceRecordId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service record not found' });
        }
        res.json({ message: 'Service record deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [records] = await pool.query(
            `SELECT sr.id, sr.car_id, sr.service_date, c.make, c.model, c.year, c.owner_name
            FROM service_records sr
            JOIN cars c ON sr.car_id = c.id
            ORDER BY sr.service_date DESC`
        );
        // For each record, get services
        const serviceRecordIds = records.map(r => r.id);
        let servicesMap = {};
        if (serviceRecordIds.length > 0) {
            const [services] = await pool.query(
                `SELECT srs.service_record_id, s.id, s.name, s.price
                FROM service_record_services srs
                JOIN services s ON srs.service_id = s.id
                WHERE srs.service_record_id IN (?)`,
                [serviceRecordIds]
            );
            servicesMap = services.reduce((acc, s) => {
                if (!acc[s.service_record_id]) acc[s.service_record_id] = [];
                acc[s.service_record_id].push({ id: s.id, name: s.name, price: s.price });
                return acc;
            }, {});
        }
        const result = records.map(r => ({
            id: r.id,
            car_id: r.car_id,
            service_date: r.service_date,
            car: {
                make: r.make,
                model: r.model,
                year: r.year,
                owner_name: r.owner_name
            },
            services: servicesMap[r.id] || []
        }));
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
