require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Product = require('./models/Product');
const authRoutes = require('./routes/auth');
const resetRoutes = require('./routes/reset');

const app = express();

// ✅ Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// ✅ Routes
app.use('/api', authRoutes);
app.use('/api', resetRoutes);

// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community-share-db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ Test route
app.get('/', (req, res) => res.send('✅ Backend Running'));

// ✅ Profile route
app.get('/api/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json(req.session.user);
});

// ✅ Reset users (Admin only)
app.delete('/api/reset-users', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    await User.deleteMany({});
    res.json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Create default admin (if needed)
app.post('/api/create-admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'Admin'
    });

    await adminUser.save();
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
