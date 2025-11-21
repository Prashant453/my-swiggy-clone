// frontend/src/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Home() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // NEW: Search State
  const [searchTerm, setSearchTerm] = useState("");

  const bannerImages = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1600&q=80"
  ];

  useEffect(() => {
    axios.get('https://foodverse-backend-jnas.onrender.com/api/foods')
      .then(response => setFoods(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % bannerImages.length), 4000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const addToCart = (food) => setCart([...cart, food]);
  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));
  const totalAmount = cart.reduce((total, item) => total + item.price, 0);
  const handleCheckout = () => navigate('/payment', { state: { cart, totalAmount } });

  // NEW: Search Filter Logic
  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    food.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">🍔 <h1>Food<span style={{color:'#fc8019'}}>Verse</span></h1></div>
        
        {/* NEW: Search Bar in Navbar */}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for food or restaurant..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <button className="cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
          🛒 Cart <span className="cart-count">{cart.length}</span>
        </button>
      </nav>

      {/* Only show Slider if NOT searching */}
      {searchTerm === "" && (
        <div className="hero-section">
          {bannerImages.map((img, index) => (
            <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`} style={{ backgroundImage: `url(${img})` }}></div>
          ))}
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h2>Hungry? We got you.</h2>
            <p>Order food from favourite restaurants near you.</p>
          </div>
        </div>
      )}

      <div className="main-container">
        <h2 className="section-title">
          {searchTerm ? `Search Results for "${searchTerm}"` : "Top Picks for You"}
        </h2>
        <div className="food-grid">
          {filteredFoods.length > 0 ? filteredFoods.map(food => (
            <div className="card" key={food.id}>
              <div className="card-img-container">
                <img src={food.image} alt={food.name} />
                <div className="rating-badge">⭐ {food.rating}</div>
              </div>
              <div className="details">
                <h3>{food.name}</h3>
                <p className="restaurant">{food.restaurant}</p>
                <div className="price-row">
                  <span className="price">₹{food.price}</span>
                  <button className="add-btn" onClick={() => addToCart(food)}>ADD</button>
                </div>
              </div>
            </div>
          )) : <p className="no-results">No food found! 😢</p>}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header"><h3>Your Cart</h3><button className="close-btn" onClick={() => setIsCartOpen(false)}>×</button></div>
        <div className="cart-items">
          {cart.length === 0 ? <div className="empty-cart">Cart is empty</div> : cart.map((item, i) => (
            <div key={i} className="cart-item-row"><span>{item.name}</span><button className="remove-btn" onClick={() => removeFromCart(i)}>Remove</button></div>
          ))}
        </div>
        {cart.length > 0 && <div className="cart-footer"><button className="checkout-btn" onClick={handleCheckout}>PROCEED TO PAY ₹{totalAmount}</button></div>}
      </div>
      {isCartOpen && <div className="overlay" onClick={() => setIsCartOpen(false)}></div>}
    </div>
  );
}

export default Home;