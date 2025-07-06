const express = require('express');
const mysql = require('mysql2');

const router = express.Router();
router.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'MiniRideDB'
});

// 1. Driver accepts a ride
router.post('/accept-ride', (req, res) => {
    const { ride_id, driver_id } = req.body;
    if (!ride_id || !driver_id) {
        return res.status(400).json({ message: 'ride_id and driver_id are required.' });
    }

    // Check if driver exists in driver table and get current_location
    const driverCheckSql = "SELECT current_location FROM driver WHERE id = ?";
    db.query(driverCheckSql, [driver_id], (err, driverRows) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        if (driverRows.length === 0) {
            return res.status(400).json({ message: 'Driver not found.' });
        }
        const current_location = driverRows[0].current_location;

        // Check if driver already has an ongoing ride
        const checkSql = "SELECT * FROM ride WHERE driver_id = ? AND status = 'ongoing'";
        db.query(checkSql, [driver_id], (err, ongoingRides) => {
            if (err) return res.status(500).json({ message: 'Database error.', error: err });
            if (ongoingRides.length > 0) {
                return res.status(400).json({ message: 'Driver already has an ongoing ride.' });
            }

            // Accept the ride
            const updateSql = "UPDATE ride SET driver_id = ?, status = 'ongoing' WHERE id = ? AND status = 'pending'";
            db.query(updateSql, [driver_id, ride_id], (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error.', error: err });
                if (result.affectedRows === 0) {
                    return res.status(400).json({ message: 'Ride not found or already accepted.' });
                }
                // Update driver status to unavailable
                const updateDriverStatusSql = "UPDATE driver SET availability_status = 'unavailable' WHERE id = ?";
                db.query(updateDriverStatusSql, [driver_id], (err) => {
                    if (err) return res.status(500).json({ message: 'Database error.', error: err });
                    res.json({ message: 'Ride accepted successfully and driver status updated.', current_location });
                });
            });
        });
    });
});

// 2. Get current ride for a driver (status: ongoing)
router.get('/current-ride/:driver_id', (req, res) => {
    const { driver_id } = req.params;
    const sql = "SELECT * FROM ride WHERE driver_id = ? AND status = 'ongoing'";
    db.query(sql, [driver_id], (err, rides) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        if (rides.length === 0) {
            return res.status(404).json({ message: 'No ongoing ride found for this driver.' });
        }
        res.json(rides[0]);
    });
});

// 3. Complete a ride
router.post('/complete-ride', (req, res) => {
    const { ride_id, driver_id } = req.body;
    if (!ride_id || !driver_id) {
        return res.status(400).json({ message: 'ride_id and driver_id are required.' });
    }
    const sql = "UPDATE ride SET status = 'completed' WHERE id = ? AND driver_id = ? AND status = 'ongoing'";
    db.query(sql, [ride_id, driver_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Ride not found or not ongoing.' });
        }
        // Get the drop_location for this ride
        const getDropSql = "SELECT drop_location FROM ride WHERE id = ?";
        db.query(getDropSql, [ride_id], (err, rows) => {
            if (err) return res.status(500).json({ message: 'Database error.', error: err });
            const drop_location = rows[0]?.drop_location || null;
            // Update driver status to available and set current_location to drop_location
            const updateDriverStatusSql = "UPDATE driver SET availability_status = 'available', current_location = ? WHERE id = ?";
            db.query(updateDriverStatusSql, [drop_location, driver_id], (err) => {
                if (err) return res.status(500).json({ message: 'Database error.', error: err });
                res.json({ message: 'Ride completed successfully, driver status and location updated.' });
            });
        });
    });
});

module.exports = router;