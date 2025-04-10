import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000'; // Ensure this matches backend port

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    console.log('Login attempt:', { email, password });
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const role = payload.role;
      localStorage.setItem('userRole', role);
      setMessage('Login successful!');
      setTimeout(() => {
        switch (role) {
          case 'admin': navigate('/admin'); break;
          case 'manager': navigate('/manager'); break;
          case 'employee': navigate('/employee'); break;
          default: navigate('/login');
        }
      }, 100);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        </div>
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        </div>
        {message && <p className="success">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;