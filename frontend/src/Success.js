// frontend/src/Success.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || "UNKNOWN";

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="checkmark-circle">
          <div className="checkmark">✓</div>
        </div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your order. Your food is being prepared.</p>
        <div className="order-id-box">
          <span>Order ID:</span>
          <strong>#{orderId}</strong>
        </div>
        <button className="btn" onClick={() => navigate('/')}>Go Home</button>
      </div>
    </div>
  );
};

export default Success;