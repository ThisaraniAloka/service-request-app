// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage';
import AdminPage from './pages/AdminPage';
import CustomerDashboard from './pages/CustomerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerPage />} />
        <Route path="/admin" element={<AdminPage />} />
         <Route path="/dashboard" element={<CustomerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
