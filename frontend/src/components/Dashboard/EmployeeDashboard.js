import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Employee Dashboard</h2>
      <p>Manage your expenses.</p>
      <ul>
        <li><button onClick={() => navigate('/expense/create')}>Submit Expense</button></li>
        <li><Link to="/expenses">View My Expenses</Link></li>
        <li><Link to="/report">View Budget Usage</Link></li>
      </ul>
    </div>
  );
};

export default EmployeeDashboard;