import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ReportingDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({ dateRange: '', status: '', category: '', team: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        let url = '/api/expense';
        const params = {};
        if (filters.dateRange) params.date = filters.dateRange;
        if (filters.status) params.status = filters.status;
        if (filters.category) params.category = filters.category;
        if (filters.team && localStorage.getItem('userRole') === 'manager') params.team = filters.team;
        const response = await axios.get(url, { params, headers: { Authorization: `Bearer ${token}` } });
        setExpenses(response.data);
      } catch (error) {
        setError('Failed to fetch expenses: ' + (error.response?.data?.message || error.message));
        console.error('Fetch expenses error:', error);
      }
    };
    fetchExpenses();
  }, [filters]);

  const pieData = {
    labels: expenses.map(e => e.category),
    datasets: [{
      data: expenses.map(e => e.amount),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }],
  };

  const barData = {
    labels: expenses.map(e => e.userId?.email || 'Unknown'),
    datasets: [{
      label: 'Expenses by User',
      data: expenses.map(e => e.amount),
      backgroundColor: '#3498db',
    }],
  };

  return (
    <div className="reporting-dashboard-container">
      <h2>Reporting Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      <div>
        <input type="month" value={filters.dateRange} onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })} placeholder="Date Range" />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input type="text" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} placeholder="Category" />
        {localStorage.getItem('userRole') === 'manager' && (
          <input type="text" value={filters.team} onChange={(e) => setFilters({ ...filters, team: e.target.value })} placeholder="Team" />
        )}
      </div>
      <div className="chart-container">
        <h3>Expenses by Category</h3>
        <Pie data={pieData} />
      </div>
      <div className="chart-container">
        <h3>Expenses by User/Team</h3>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default ReportingDashboard;