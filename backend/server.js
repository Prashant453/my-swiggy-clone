// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
// REPLACE THE STRING BELOW WITH YOUR MONGODB CONNECTION STRING IF RUNNING LOCALLY
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://prashant65001:GSTin74880.@cluster0.spc5zzy.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// 2. Define Database Schemas
const FoodSchema = new mongoose.Schema({
    id: Number,
    name: String,
    restaurant: String,
    price: Number,
    rating: Number,
    image: String
});

const OrderSchema = new mongoose.Schema({
    items: Array,
    total: Number,
    method: String,
    date: { type: Date, default: Date.now }
});

const Food = mongoose.model('Food', FoodSchema);
const Order = mongoose.model('Order', OrderSchema);

// 3. Default Food Data (Used to seed the DB)
const defaultFoodData = [
     { id: 1, name: "Maharaja Burger", restaurant: "Burger King", price: 199, rating: 4.5, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
    { id: 2, name: "Farmhouse Pizza", restaurant: "Pizza Hut", price: 299, rating: 4.2, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80" },
    { id: 3, name: "Hyderabadi Biryani", restaurant: "Behrouz", price: 350, rating: 4.8, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&q=80" },
    { id: 4, name: "Masala Dosa", restaurant: "Saravana Bhavan", price: 120, rating: 4.6, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80" },
    { id: 5, name: "Choco Lava Cake", restaurant: "Dominos", price: 99, rating: 4.9, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" },
    { id: 6, name: "Sushi Platter", restaurant: "Sushi Haus", price: 599, rating: 4.7, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80" },
    { id: 7, name: "Butter Chicken", restaurant: "Punjab Grill", price: 450, rating: 4.4, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80" },
    { id: 8, name: "Tacos", restaurant: "Taco Bell", price: 149, rating: 4.1, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80" },
    { id: 9, name: "Pasta Alfredo", restaurant: "Little Italy", price: 280, rating: 4.3, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80" },
    { id: 10, name: "Hakka Noodles", restaurant: "Mainland China", price: 210, rating: 4.0, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80" },
    { id: 11, name: "Cold Coffee", restaurant: "Starbucks", price: 250, rating: 4.6, image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&q=80" },
    { id: 12, name: "Veg Momos", restaurant: "Wow! Momo", price: 110, rating: 4.2, image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500&q=80" }
];

// 4. API Routes
app.get('/api/foods', async (req, res) => {
    // Check if DB is empty, if yes, seed it
    const count = await Food.countDocuments();
    if (count === 0) {
        await Food.insertMany(defaultFoodData);
        console.log("Database seeded with food!");
    }
    const foods = await Food.find(); // Fetch from DB
    res.json(foods);
});

app.post('/api/order', async (req, res) => {
    const { items, total, method } = req.body;
    const newOrder = new Order({ items, total, method });
    const savedOrder = await newOrder.save(); // Save to DB
    
    console.log("Order Saved:", savedOrder._id);
    res.json({ message: "Order placed successfully!", orderId: savedOrder._id });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});