const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

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

// Registration endpoint
app.post('/register', async (req, res) => {
    const { name, password, type, phone_number, current_location } = req.body;
    if (!name || !password || !type || !phone_number || (type === 'driver' && !current_location)) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO user (name, password, type, phone_number) VALUES (?, ?, ?, ?)';
        db.query(sql, [name, hashedPassword, type, phone_number], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'User already exists.' });
                }
                return res.status(500).json({ message: 'Database error.', error: err });
            }

            // If user is a driver, also add to driver table
            if (type === 'driver') {
                const userId = result.insertId;
                const driverSql = 'INSERT INTO driver (id, name, current_location) VALUES (?, ?, ?)';
                db.query(driverSql, [userId, name, current_location], (driverErr) => {
                    if (driverErr) {
                        return res.status(500).json({ message: 'Driver table error.', error: driverErr });
                    }
                    res.status(201).json({ message: 'Driver registered successfully.' });
                });
            } else {
                res.status(201).json({ message: 'User registered successfully.' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error hashing password.', error });
    }
});

module.exports = app;