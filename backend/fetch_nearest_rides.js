const express = require('express');
const axios = require('axios');
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

// API: Fetch nearest rides for driver (GET, uses driver's current_location from DB)
router.get('/nearest-rides/:driver_id', async (req, res) => {
    const { driver_id } = req.params;
    if (!driver_id) {
        return res.status(400).json({ message: 'Driver ID is required.' });
    }
    try {
        // 1. Get driver's current_location from driver table
        const driverSql = "SELECT current_location FROM driver WHERE id = ?";
        db.query(driverSql, [driver_id], async (err, driverRows) => {
            if (err) return res.status(500).json({ message: 'Database error.', error: err });
            if (driverRows.length === 0) {
                return res.status(404).json({ message: 'Driver not found.' });
            }
            const current_location = driverRows[0].current_location;
            if (!current_location) {
                return res.status(400).json({ message: 'Driver current location not set.' });
            }

            // 2. Geocode driver's current location
            const driverCoord = await geocodePlace(current_location);

            // 3. Get all pending rides
            const sql = "SELECT * FROM ride WHERE status = 'pending'";
            db.query(sql, (err, rides) => {
                if (err) return res.status(500).json({ message: 'Database error.', error: err });

                // 4. Calculate distance for each ride
                const ridesWithDistance = rides.map(ride => {
                    const pickupCoord = { lat: ride.pickup_lat, lon: ride.pickup_lon };
                    const distance = haversineDistance(driverCoord, pickupCoord);
                    return { ...ride, distance };
                });

                // 5. Sort by distance
                ridesWithDistance.sort((a, b) => a.distance - b.distance);

                res.json(ridesWithDistance);
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error finding nearest rides.', error: error.message });
    }
});

module.exports = router;