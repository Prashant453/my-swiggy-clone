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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1600&q=80"
  ];

  useEffect(() => {
    // Fetching from your RENDER Backend
    axios.get('https://foodverse-backend-jnas.onrender.com/api/foods')
      .then(response => setFoods(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % bannerImages.length), 4000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // --- QUANTITY LOGIC ---
  const getItemQty = (id) => {
    const item = cart.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  const increaseQty = (food) => {
    const existingItem = cart.find(item => item.id === food.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  const decreaseQty = (food) => {
    const existingItem = cart.find(item => item.id === food.id);
    if (existingItem.quantity === 1) {
      setCart(cart.filter(item => item.id !== food.id));
    } else {
      setCart(cart.map(item => item.id === food.id ? { ...item, quantity: item.quantity - 1 } : item));
    }
  };

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const handleCheckout = () => navigate('/payment', { state: { cart, totalAmount } });
  
  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    food.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">🍔 <h1>Food<span style={{color:'#fc8019'}}>Verse</span></h1></div>
        <div className="search-bar">
          <input type="text" placeholder="Search for food..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          <span className="search-icon">🔍</span>
        </div>
        <button className="cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
          🛒 Cart <span className="cart-count">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
        </button>
      </nav>

      {searchTerm === "" && (
        <div className="hero-section">
          {bannerImages.map((img, index) => (
            <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`} style={{ backgroundImage: `url(${img})` }}></div>
          ))}
          <div className="hero-overlay"></div>
          <div className="hero-content"><h2>Hungry? We got you.</h2><p>Order food from favourite restaurants near you.</p></div>
        </div>
      )}

      <div className="main-container">
        <h2 className="section-title">{searchTerm ? `Results for "${searchTerm}"` : "Top Picks for You"}</h2>
        <div className="food-grid">
          {filteredFoods.map(food => {
            const qty = getItemQty(food.id);
            return (
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
                    {/* BUTTON LOGIC */}
                    {qty === 0 ? (
                      <button className="add-btn" onClick={() => increaseQty(food)}>ADD</button>
                    ) : (
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => decreaseQty(food)}>-</button>
                        <span className="qty-count">{qty}</span>
                        <button className="qty-btn" onClick={() => increaseQty(food)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header"><h3>Your Cart</h3><button className="close-btn" onClick={() => setIsCartOpen(false)}>×</button></div>
        <div className="cart-items">
          {cart.length === 0 ? <div className="empty-cart">Cart is empty</div> : cart.map((item) => (
            <div key={item.id} className="cart-item-row">
              <div className="cart-item-info"><span>{item.name}</span><small>₹{item.price} x {item.quantity}</small></div>
              <div className="cart-qty-mini">
                <button onClick={() => decreaseQty(item)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item)}>+</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && <div className="cart-footer"><button className="checkout-btn" onClick={handleCheckout}>PAY ₹{totalAmount}</button></div>}
      </div>
      {isCartOpen && <div className="overlay" onClick={() => setIsCartOpen(false)}></div>}
    </div>
  );
}
export default Home;