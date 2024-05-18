const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/middlewares');
const { fetchDashboardData } = require('../utils/sqlQueries'); 

//Route to render the dashboard view
router.get('/dashboard', isAuthenticated, (req, res) => {
  try {
    console.log(`Rendering dashboard for user: ${req.user.id}`);
    const registrations = req.app.locals.registrations; 

    res.render('dashboard', { user: req.user, registrations: registrations[req.user.id] || [] });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Route to fetch user registrations
router.get('/user-registrations', isAuthenticated, (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = req.app.locals.registrations; 
    console.log(`Checking registrations for user: ${userId}`);
    if (registrations[userId]) {
      res.json(registrations[userId]);
    } else {
      res.status(404).json({ message: 'User not registered' });
    }
  } catch (error) {
    console.error('Error fetching user registrations:', error.message, error.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;