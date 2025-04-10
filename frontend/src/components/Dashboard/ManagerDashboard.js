import React from 'react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  return (
    <div className="container">
      <h2>Manager Dashboard</h2>
      <p>Manage team expenses and budgets.</p>
      <ul>
        <li><Link to="/expenses">Approve/Reject Expenses</Link></li>
        <li><Link to="/report">View Team Transactions</Link></li>
        <li><Link to="/budget">Set Team Budgets</Link></li>
      </ul>
    </div>
  );
};

export default ManagerDashboard;