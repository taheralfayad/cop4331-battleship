// api.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const sha256 = require('js-sha256');

require('dotenv').config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'usersDB'
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Define a user schema
const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 0
    }
  });

// Create or find a mongoose model
const User = mongoose.model('User', UserSchema, 'Users');

// API endpoints

// Retrieve requested user
router.get('/login', async (req, res) => {
  try {
    const username = req.query.username;
    const password = sha256(req.query.password);
    const user = await User.findOne({ username: username, password: password });
    res.json(user);
    console.log(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/register', async (req, res) => {
    try {
      // Check if username already exists
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      // Hash Password
      const pass = sha256(req.body.password)
      // Create a new user
      const user = new User({
        username: req.body.username,
        password: pass,
        email: req.body.email,
        score: req.body.score || 0
      });
  
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

module.exports = router;
