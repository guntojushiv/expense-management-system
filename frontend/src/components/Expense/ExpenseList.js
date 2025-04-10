import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role;
        const userId = payload.id;
        let url = '/api/expense';
        if (userRole === 'employee') url += `?userId=${userId}`;
        else if (userRole === 'manager') url += '?status=pending';
        const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        setExpenses(response.data);
      } catch (error) {
        setError('Failed to fetch expenses: ' + (error.response?.data?.message || error.message));
        console.error('Fetch expenses error:', error);
      }
    };
    fetchExpenses();
  }, []);

  const handleEdit = (id) => navigate(`/expense/edit/${id}`);
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/expense/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (error) {
      setError('Failed to delete expense: ' + (error.response?.data?.message || error.message));
      console.error('Delete error:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/expense/${id}`, { status: 'approved' }, { headers: { Authorization: `Bearer ${token}` } });
      setExpenses(expenses.map(exp => exp._id === id ? { ...exp, status: 'approved' } : exp));
    } catch (error) {
      setError('Failed to approve expense: ' + (error.response?.data?.message || error.message));
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/expense/${id}`, { status: 'rejected' }, { headers: { Authorization: `Bearer ${token}` } });
      setExpenses(expenses.map(exp => exp._id === id ? { ...exp, status: 'rejected' } : exp));
    } catch (error) {
      setError('Failed to reject expense: ' + (error.response?.data?.message || error.message));
      console.error('Reject error:', error);
    }
  };

  return (
    <div className="expense-list-container">
      <h2>Expense List</h2>
      {error && <p className="error-message">{error}</p>}
      {expenses.length > 0 ? (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense._id} className="expense-item">
              <span>{expense.title} - ${expense.amount} ({expense.status})</span>
              <div>
                {localStorage.getItem('userRole') === 'employee' && (
                  <>
                    <button className="action-btn edit-btn" onClick={() => handleEdit(expense._id)}>Edit</button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(expense._id)}>Delete</button>
                  </>
                )}
                {localStorage.getItem('userRole') === 'manager' && (
                  <>
                    <button className="action-btn approve-btn" onClick={() => handleApprove(expense._id)}>Approve</button>
                    <button className="action-btn reject-btn" onClick={() => handleReject(expense._id)}>Reject</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses found.</p>
      )}
    </div>
  );
};

export default ExpenseList;