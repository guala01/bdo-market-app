const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const config = require('./config');

//Passport configuration
passport.use(new DiscordStrategy({
  clientID: config.discordClientId,
  clientSecret: config.discordClientSecret,
  callbackURL: config.discordCallbackUrl,
  scope: ['identify']
}, (accessToken, refreshToken, profile, done) => {
  try {
    const { id, username, discriminator } = profile;
    return done(null, profile);
  } catch (error) {
    console.error('Error in Discord strategy callback:', error);
    return done(error, null);
  }
}));

//Serialize user information to the session
passport.serializeUser((user, done) => {
  try {
    done(null, user);
  } catch (error) {
    console.error('Error serializing user:', error);
    done(error, null);
  }
});

passport.deserializeUser((obj, done) => {
  try {
    done(null, obj);
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error, null);
  }
});

module.exports = passport;