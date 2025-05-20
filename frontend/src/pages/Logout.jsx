import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      } catch {
        // ignore errors
      }
      localStorage.removeItem('user');
      navigate('/login');
    };
    logout();
  }, [navigate]);

  return <div>Logging out...</div>;
}

export default Logout;
