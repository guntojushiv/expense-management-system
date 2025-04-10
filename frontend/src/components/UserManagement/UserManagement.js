import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch users: ' + (error.response?.data?.message || error.message));
        console.error('Fetch users error:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      setError('Failed to delete user: ' + (error.response?.data?.message || error.message));
      console.error('Delete user error:', error);
    }
  };

  return (
    <div className="user-management-container">
      <h2>User Management</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="user-row">
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="action-btn edit-btn">Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3">No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;