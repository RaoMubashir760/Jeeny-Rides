Objective: 
The goal of this project is to do development using React, Node.js, Express, and MySQL.
It includes the creatation of a functional, and user-centric web app that implements real-world ride matching logic.

Tech Stack
Frontend: React.js
Backend: Node.js with Express
Database: MySQL
APIs: OpenStreetMap (for geolocation), custom APIs

Core Features

Authentication:
Users can register and log in using name, password, and phone number.
Role-based redirection to either the Passenger or Driver dashboard after login.

Passenger Dashboard:
View a ride request form (if no ride is ongoing).
View details and status of any ongoing ride.
View ride history.

Driver Dashboard:
See the currently assigned ride (if any).
Complete an ongoing ride.
View nearby ride requests sorted by straight-line distance.
Accept a ride request if not already on a ride.

Database Structure

User Table:
id
name
password
phone_number
type (either 'passenger' or 'driver')

Driver Table:
id
name
availability_status (available/unavailable)
current_location

Ride Table:
id
passenger_id
driver_id
pickup_location
drop_location
ride_type
status (pending/ongoing/completed/cancelled)
pickup_lat
pickup_lon
