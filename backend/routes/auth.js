const express = require('express');
const bcrypt = require('bcrypt');
const { pool, isAuthenticated } = require('../server');

const router = express.Router();

// POST /login - Authenticate user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
    }
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        req.session.userId = user.id;
        req.session.username = user.username;
        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /me - Get current logged-in user info
router.get('/me', isAuthenticated, (req, res) => {
    res.json({ id: req.session.userId, username: req.session.username });
});

module.exports = router;
