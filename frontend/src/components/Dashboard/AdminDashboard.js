import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p>Full control over the system.</p>
      <ul>
        <li><Link to="/users">Manage Users & Companies</Link></li>
        <li><Link to="/expenses">View All Expense Reports</Link></li>
        <li><Link to="/budget">Set Global Categories & Budgets</Link></li>
        <li><Link to="/report">View Reports</Link></li>
      </ul>
    </div>
  );
};

export default AdminDashboard;