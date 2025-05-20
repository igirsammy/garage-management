import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Car from './pages/Car';
import Services from './pages/Services';
import ServiceRecord from './pages/ServiceRecord';
import Payment from './pages/Payment';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Layout from './components/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />
        {isAuthenticated ? (
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="car" element={<Car />} />
            <Route path="services" element={<Services />} />
            <Route path="servicerecord" element={<ServiceRecord />} />
            <Route path="payment" element={<Payment />} />
            <Route path="reports" element={<Reports />} />
            <Route path="logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
