const config = require('./config');
const loadRegistrations = require('./registrationMiddleware');


function isWhitelisted(userId) {
  const whitelistedUsers = config.whitelistedUsers || [];
  return whitelistedUsers.includes(userId);
}

//Logic to check if the user is authenticated and whitelisted
function isAuthenticated(req, res, next) {
  loadRegistrations(req, res, () => {
    if (!req.isAuthenticated()) {
      console.log('User is not authenticated');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!isWhitelisted(req.user.id)) {
      console.log(`User ${req.user.id} is not whitelisted`);
      return res.status(403).json({ message: 'Forbidden' });
    }
    console.log(`User ${req.user.id} is authenticated and whitelisted`);
    return next();
  });
}

module.exports = {
  isAuthenticated
};

