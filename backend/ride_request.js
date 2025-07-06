const express = require('express');
const axios = require('axios');
const app = require('./registration');
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

// Helper: Geocode a place name to lat/lon using Nominatim
async function geocodePlace(place) {
    const url = `https://nominatim.openstreetmap.org/search`;
    const params = {
        q: place,
        format: 'json',
        limit: 1
    };
    const response = await axios.get(url, { params, headers: { 'User-Agent': 'MiniRideApp/1.0' } });
    if (response.data.length === 0) throw new Error(`Place not found: ${place}`);
    const { lat, lon } = response.data[0];
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
}

// Helper: Haversine formula for straight-line distance (in km)
function haversineDistance(coord1, coord2) {
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lon - coord1.lon);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// API endpoint: Calculate distance between driver and passenger
router.post('/distance', async (req, res) => {
    const { pickup_location, driver_location } = req.body;
    if (!pickup_location || !driver_location) {
        return res.status(400).json({ message: 'Both pickup_location and driver_location are required.' });
    }
    try {
        const [pickupCoord, driverCoord] = await Promise.all([
            geocodePlace(pickup_location),
            geocodePlace(driver_location)
        ]);
        const straightLineKm = haversineDistance(pickupCoord, driverCoord);

        // For now, just return straight-line distance. Driving distance can be added later.
        res.json({
            pickup_location,
            driver_location,
            pickupCoord,
            driverCoord,
            straightLineKm
        });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating distance.', error: error.message });
    }
});

// Passenger requests a ride
router.post('/request-ride', async (req, res) => {
    const { passenger_id, pickup_location, drop_location, ride_type } = req.body;
    if (!passenger_id || !pickup_location || !drop_location || !ride_type) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const pickupCoord = await geocodePlace(pickup_location);
        const sql = `INSERT INTO ride (passenger_id, pickup_location, drop_location, ride_type, status, pickup_lat, pickup_lon)
                     VALUES (?, ?, ?, ?, 'pending', ?, ?)`;
        db.query(sql, [passenger_id, pickup_location, drop_location, ride_type, pickupCoord.lat, pickupCoord.lon], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error.', error: err });
            }
            res.status(201).json({ message: 'Ride requested successfully.' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error requesting ride.', error: error.message });
    }
});

// Passenger  ongoing ride
router.get('/ongoing-ride/:passenger_id', async (req, res) => {
    const { passenger_id } = req.params;
    if (!passenger_id) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        
        const sql = `select * from ride where passenger_id = ? and status = 'ongoing'`;
        db.query(sql, [passenger_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error.', error: err });
            }
            res.status(201).json({ result, message: 'Ongoing ride fetched successfully.' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error requesting ride.', error: error.message });
    }
});

// Passenger ride history
router.get('/history-ride/:passenger_id', async (req, res) => {
    const { passenger_id } = req.params;
    if (!passenger_id) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        
        const sql = `select * from ride where passenger_id = ? and status = 'completed'`;
        db.query(sql, [passenger_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error.', error: err });
            }
            res.status(201).json({ result, message: 'Completed ride fetched successfully.' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error requesting ride.', error: error.message });
    }
});



module.exports = router;