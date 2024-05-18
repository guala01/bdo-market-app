const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/middlewares');
const { fetchDashboardData } = require('../utils/sqlQueries');
const { isValidDays } = require('../utils/validators');

//Data fetching route
router.get('/dashboardData', isAuthenticated, async (req, res) => {
  let { days } = req.query;

  if (!days) {
    days = 7; //Default to 7 days if no days parameter is provided - might be useless since defined in dashboard.ejs
  }

  try {
    if (!isValidDays(days)) {
      console.log(`Invalid days parameter: ${days}`);
      return res.status(400).json({ message: 'Invalid days parameter' });
    }

    console.log(`Fetching data for user: ${req.user.id} for the past ${days} days`);
    const data = await fetchDashboardData(days);

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error.message, error.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;