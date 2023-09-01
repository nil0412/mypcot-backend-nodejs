// Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Mongoose schemas and models for User, Record, and Category
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  gender: String,
});

const User = mongoose.model('User', userSchema);

// Define routes for user registration and login
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ name, email, password: hashedPassword, gender });
    await user.save();

    // Generate and send a JWT token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate and send a JWT token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Define routes for CRUD operations on records and categories

// Implement CRUD routes for records and categories similarly to user registration and login

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
