const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.delete('/reset-users', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }

  await User.deleteMany({});
  res.json({ message: 'All users deleted successfully' });
});

module.exports = router;
