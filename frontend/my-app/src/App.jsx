import Registration from './screens/registration.jsx';
import Login from './screens/login.jsx';
import PassengerDashboard from './screens/PassengerDashboard.jsx';
import DriverDashboard from './screens/DriverDashboard.jsx';
import Navbar from './screens/Navbar.jsx';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* AutoRedirect component checks localStorage and redirects user based on role */}
        <AutoRedirect />
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/passenger-dashboard" element={<PassengerDashboard />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

// This component checks localStorage and routes user based on role
function AutoRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId');

    // If user is already logged in, redirect them
    if (userType === 'passenger') {
      navigate('/passenger-dashboard');
    } else if (userType === 'driver') {
      navigate('/driver-dashboard');
    }
  }, []);

  return null;
}

export default App;
