// frontend/src/Payment.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get cart and total from the previous page
  // Default to empty array if direct access
  const { cart, totalAmount } = location.state || { cart: [], totalAmount: 0 };
  
  const [paymentMethod, setPaymentMethod] = useState('card'); // Options: card, upi, cod
  const [loading, setLoading] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      // USE YOUR RENDER BACKEND URL HERE
      axios.post('https://foodverse-backend-jnas.onrender.com/api/order', { 
        items: cart, 
        total: totalAmount, 
        method: paymentMethod 
      })
      .then(res => {
        setLoading(false);
        // Navigate to Success Page with the Order ID
        navigate('/success', { state: { orderId: res.data.orderId } });
      })
      .catch(err => { 
        console.error(err);
        setLoading(false); 
        alert("Payment Failed. Please try again."); 
      });
    }, 2000);
  };

  // If cart is empty, redirect home
  if (!location.state) {
     return (
       <div className="payment-page">
         <h2>No items to checkout</h2>
         <button className="btn" onClick={() => navigate('/')}>Go Home</button>
       </div>
     );
  }

  return (
    <div className="payment-page">
      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          🍔 <h1>Food<span style={{color:'#fc8019'}}>Verse</span></h1>
        </div>
        <h3>Secure Checkout 🔒</h3>
      </nav>

      <div className="payment-container">
        
        {/* LEFT SIDE: Payment Forms */}
        <div className="payment-form-section">
          <h2>Select Payment Method</h2>
          
          {/* Payment Tabs */}
          <div className="payment-tabs">
            <button 
              className={`tab ${paymentMethod === 'card' ? 'active' : ''}`} 
              onClick={() => setPaymentMethod('card')}
            >
              💳 Card
            </button>
            <button 
              className={`tab ${paymentMethod === 'upi' ? 'active' : ''}`} 
              onClick={() => setPaymentMethod('upi')}
            >
              📱 UPI
            </button>
            <button 
              className={`tab ${paymentMethod === 'cod' ? 'active' : ''}`} 
              onClick={() => setPaymentMethod('cod')}
            >
              💵 COD
            </button>
          </div>

          <form onSubmit={handlePayment}>
            {/* CARD FORM */}
            {paymentMethod === 'card' && (
              <div className="method-section">
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" required />
                </div>
                <div className="row">
                  <div className="form-group half">
                    <label>Expiry</label>
                    <input type="text" placeholder="MM/YY" required />
                  </div>
                  <div className="form-group half">
                    <label>CVV</label>
                    <input type="password" placeholder="123" maxLength="3" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input type="text" placeholder="John Doe" required />
                </div>
              </div>
            )}

            {/* UPI FORM */}
            {paymentMethod === 'upi' && (
              <div className="method-section">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input type="text" placeholder="example@okicici" required />
                </div>
                <p className="info-text">A payment request will be sent to your UPI App.</p>
              </div>
            )}

            {/* COD FORM */}
            {paymentMethod === 'cod' && (
              <div className="method-section">
                <div className="cod-info">
                  <span style={{fontSize: '2rem'}}>🚚</span>
                  <p>Pay cash to the delivery partner upon arrival.</p>
                </div>
              </div>
            )}

            <button type="submit" className="pay-btn" disabled={loading}>
              {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${totalAmount}`}
            </button>
          </form>
        </div>
        
        {/* RIGHT SIDE: Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-list">
            {cart.map((item, index) => (
              <div key={index} className="summary-item">
                {/* This shows: 2 x Burger */}
                <span>{item.quantity} x {item.name}</span>
                {/* This shows total: 398 */}
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="summary-total">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;