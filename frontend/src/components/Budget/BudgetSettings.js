import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetSettings = () => {
  const [budget, setBudget] = useState({ amount: '', type: 'company', team: '', month: new Date().toISOString().slice(0, 7) });
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/budget', { headers: { Authorization: `Bearer ${token}` } });
        setBudgets(response.data);
      } catch (error) {
        setError('Failed to fetch budgets: ' + (error.response?.data?.message || error.message));
        console.error('Fetch budgets error:', error);
      }
    };
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role;
      if (userRole !== 'admin' && budget.type === 'company') {
        setError('Only admins can set company budgets');
        return;
      }
      await axios.post('/api/budget', { ...budget, createdBy: payload.id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudget({ amount: '', type: 'company', team: '', month: new Date().toISOString().slice(0, 7) });
      setError('');
    } catch (error) {
      setError('Failed to set budget: ' + (error.response?.data?.message || error.message));
      console.error('Set budget error:', error);
    }
  };

  return (
    <div className="budget-settings-container">
      <h2>Budget Settings</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input type="number" value={budget.amount} onChange={(e) => setBudget({ ...budget, amount: e.target.value })} placeholder="Amount" required />
        </div>
        <div>
          <select value={budget.type} onChange={(e) => setBudget({ ...budget, type: e.target.value })}>
            <option value="company">Company</option>
            <option value="team">Team</option>
          </select>
        </div>
        {budget.type === 'team' && (
          <div>
            <input type="text" value={budget.team} onChange={(e) => setBudget({ ...budget, team: e.target.value })} placeholder="Team Name" required />
          </div>
        )}
        <div>
          <input type="month" value={budget.month} onChange={(e) => setBudget({ ...budget, month: e.target.value })} required />
        </div>
        <button type="submit">Set Budget</button>
      </form>
      <h3>Existing Budgets</h3>
      <ul>
        {budgets.map((b) => <li key={b._id}>{b.amount} for {b.type} {b.team ? `(${b.team})` : ''} in {b.month}</li>)}
      </ul>
    </div>
  );
};

export default BudgetSettings;