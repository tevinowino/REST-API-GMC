const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3000; 

app.use(express.json()); 

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import User model
const User = require('./models/User');

// 10. Create routes

// GET: RETURN ALL USERS
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Find all users
        res.json(users); // Send users in response
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle errors
    }
});

// POST: ADD A NEW USER TO THE DATABASE
app.post('/users', async (req, res) => {
    const user = new User(req.body); // Create new user instance
    try {
        const savedUser = await user.save(); // Save user to the database
        res.status(201).json(savedUser); // Return the created user
    } catch (err) {
        res.status(400).json({ message: err.message }); // Handle validation errors
    }
});

// PUT: EDIT A USER BY ID
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update user
        if (!updatedUser) return res.status(404).json({ message: 'User not found' }); // Handle not found
        res.json(updatedUser); // Return updated user
    } catch (err) {
        res.status(400).json({ message: err.message }); // Handle errors
    }
});

// DELETE: REMOVE A USER BY ID
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndRemove(req.params.id); // Remove user
        if (!deletedUser) return res.status(404).json({ message: 'User not found' }); // Handle not found
        res.json({ message: 'User deleted' }); // Confirmation message
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle errors
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
