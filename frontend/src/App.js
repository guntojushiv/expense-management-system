import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import ExpenseForm from './components/Expense/ExpenseForm';
import ExpenseList from './components/Expense/ExpenseList';
import UserManagement from './components/UserManagement/UserManagement';
import BudgetSettings from './components/Budget/BudgetSettings';
import ReportingDashboard from './components/Reporting/ReportingDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);

  useEffect(() => {
    console.log('App useEffect triggered');
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        console.log('Decoded role:', role);
        setUserRole(role);
        localStorage.setItem('userRole', role);
      } catch (e) {
        console.error('Token decoding error:', e);
        setUserRole(null);
      }
    } else {
      console.log('No token found');
      setUserRole(null);
    }
  }, []);

  const getDashboardRoute = () => {
    console.log('getDashboardRoute called, userRole:', userRole);
    if (!userRole) return '/login';
    switch (userRole) {
      case 'admin': return '/admin';
      case 'manager': return '/manager';
      case 'employee': return '/employee';
      default: return '/login';
    }
  };

  return (
    <Router>
      <div className="container">
        <h1>Expense Management System</h1>
        <Routes>
          <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute role="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <ExpenseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expense/create"
            element={
              <ProtectedRoute>
                <ExpenseForm onSuccess={() => window.location.reload()} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute role="admin">
                <BudgetSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportingDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;