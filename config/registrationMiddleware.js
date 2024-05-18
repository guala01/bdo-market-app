const fs = require('fs');
const path = require('path');

//logic to load and check registrations
const loadRegistrations = (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../scripts/registrations.json'), 'utf8');
    req.app.locals.registrations = JSON.parse(data);
    console.log('Registrations reloaded successfully.');
  } catch (err) {
    console.error('Error loading registrations.json:', err);
  }
  next();
};

module.exports = loadRegistrations;