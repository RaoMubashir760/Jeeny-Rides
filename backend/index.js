const express = require('express');
const registrationRouter = require('./registration');
const loginRouter = require('./login');
const rideRequestRouter = require('./ride_request');
const fetchRide = require('./fetch_nearest_rides');
const acceptRideRouter = require('./accept_ride');


const app = express();
app.use(express.json());

app.use(registrationRouter);
app.use(loginRouter);
app.use(rideRequestRouter);
app.use(fetchRide);
app.use(acceptRideRouter);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});