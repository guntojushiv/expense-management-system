import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExpenseForm = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [project, setProject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('amount', amount);
    formData.append('category', category);
    formData.append('project', project);
    formData.append('date', date);
    formData.append('notes', notes);
    if (receipt) formData.append('receipt', receipt);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/expense', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setTitle(''); setAmount(''); setCategory(''); setProject('');
      setDate(new Date().toISOString().split('T')[0]); setNotes('');
      setReceipt(null); setError('');
      onSuccess();
      navigate('/expenses');
    } catch (error) {
      setError('Failed to create expense: ' + (error.response?.data?.message || error.message));
      console.error('Expense creation error:', error);
    }
  };

  return (
    <div className="expense-form-container">
      <h2>Create Expense</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        </div>
        <div>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" step="0.01" required />
        </div>
        <div>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
        </div>
        <div>
          <input type="text" value={project} onChange={(e) => setProject(e.target.value)} placeholder="Project/Client (optional)" />
        </div>
        <div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        </div>
        <div>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => setReceipt(e.target.files[0])} />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Submit Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;