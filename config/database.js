const { Sequelize } = require('sequelize');
const config = require('../config/config');

//Squelize still gives errors on db migration even if configuration is loaded properly
//console.log('Database configuration:', config);

const sequelize = new Sequelize(
  config.dbName, 
  config.dbUser, 
  config.dbPassword, 
  {
    host: config.dbHost,
    port: config.dbPort,
    dialect: 'postgres',
    logging: false, //Turn on for database queries logging in console
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the PostgreSQL database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
