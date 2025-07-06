const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'MiniRideDB'
});

// Secret key for JWT
const JWT_SECRET = 'root'; // Change this to a strong secret in production

// Login endpoint
app.post('/login', (req, res) => {
    const { phone_number, password } = req.body;
    if (!phone_number || !password) {
        return res.status(400).json({ message: 'Phone number and password are required.' });
    }

    const sql = 'SELECT * FROM user WHERE phone_number = ?';
    db.query(sql, [phone_number], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', error: err });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, phone_number: user.phone_number, type: user.type },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            type: user.type,
            name: user.name,
            id: user.id
        });
    });
});

module.exports = app;