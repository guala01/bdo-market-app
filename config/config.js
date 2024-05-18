const dotenv = require('dotenv');

dotenv.config();

console.log('Environment variables loaded from .env file');

//TODO add dev and prod environments
module.exports = {
  port: process.env.PORT,
  sessionSecret: process.env.SESSION_SECRET, 
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER, 
  dbPassword: process.env.DB_PASSWORD, 
  dbName: process.env.DB_NAME,
  dbDialect: process.env.DB_DIALECT, //Squelize still gives dialect error on migration
  dbPort: process.env.DB_PORT,
  discordClientId: process.env.DISCORD_CLIENT_ID, 
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
  discordCallbackUrl: process.env.DISCORD_CALLBACK_URL,
  dialect: 'postgres', //Prob useless
  whitelistedUsers: process.env.WHITELISTED_USERS ? process.env.WHITELISTED_USERS.split(',') : [] 
};