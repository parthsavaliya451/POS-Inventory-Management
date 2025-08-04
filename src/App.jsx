import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';  // <-- Import Products page
import Cashiers from './pages/Cashiers'; // import it

import { Container } from '@mui/material';
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';
import Sections from './pages/Sections';
import Deals from './pages/Deals';

function App() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Add just products route */}
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/subcategories" element={<Subcategories />} />
        <Route path="/sections" element={<Sections />} />
        <Route path="/deals" element={<Deals/>} />
          <Route path="/cashiers" element={<Cashiers />} />

      </Routes>
    </Container>
  );
}

export default App;
