// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // ✅ Import bcrypt

const Product = require('./models/Product');
const User = require('./models/User'); // ✅ External model file

const app = express();
const PORT = 5000;

// 🔌 MongoDB Connection
mongoose.connect('mongodb://localhost:27017/resource-sharing', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// 🔧 Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// 📝 Signup Route
// server.js or routes file
const bcrypt = require('bcrypt');

app.post('/api/signup', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // ✅ hash password

    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔐 Login Route (with bcrypt)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // 🔐 compare hashed
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.user = {
      _id: user._id,
      email: user.email,
      role: user.role
    };

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// 👤 Get Logged-In User Profile
app.get('/api/profile', (req, res) => {
  console.log('Session user:', req.session.user); // 👈 Logs the logged-in user

  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  res.json(req.session.user);
});

// 📦 Add Product (Seller only)
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, category, image } = req.body;
    const user = req.session.user;

    if (!user || user.role !== 'Seller') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const product = new Product({
      name,
      description,
      category,
      image,
      owner: user._id
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Error adding product' });
  }
});
// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ Store user role in session
    req.session.user = {
      _id: user._id,
      email: user.email,
      role: user.role // make sure role is 'Seller' or 'Buyer'
    };

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// 📥 Get All Available Products (Buyer)
app.get('/api/products', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const products = await Product.find({ isAvailable: true }).populate('owner', 'email role');
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes); // ✅ Must be after all app.use()

// ❌ Delete all users (for admin/debug/testing only)
app.delete('/api/reset-users', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
