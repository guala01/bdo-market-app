const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('./config/auth'); 
const config = require('./config/config.js'); 
const sequelize = require('./config/database'); 
const authRoutes = require('./routes/authRoutes'); 
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const apiRoutes = require('./routes/apiRoutes'); 
const loadRegistrations = require('./config/registrationMiddleware'); 

const app = express();
const PORT = config.port;

//Express configuration
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(loadRegistrations);

//DB functionality test
app.get('/ping', async (req, res) => {
  try {
    await sequelize.authenticate(); 
    res.status(200).send('pong');
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send('Database connection error');
  }
});

//Home, auth, dashboard, api routes
app.get('/', (req, res) => {
  res.render('index');
});


app.use('/', authRoutes);


app.use('/', dashboardRoutes);


app.use('/api', apiRoutes);

//Models to setup DB
const { Item, MarketSnapshot, ItemTrade } = require('./models');

//DB sync and start server
const syncAndStartServer = async (port, retries = 5) => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    if (err.code === 'EADDRINUSE' && retries > 0) {
      console.error(`Port ${port} is already in use. Trying another port...`);
      syncAndStartServer(port + 1, retries - 1); //Doesn't work
    } else {
      console.error('Unable to connect to the database or no retries left:', err);
    }
  }
};

syncAndStartServer(PORT);

module.exports = { app };