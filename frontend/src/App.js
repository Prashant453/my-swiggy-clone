// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Payment from './Payment';
import Success from './Success'; // Import New Page
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;