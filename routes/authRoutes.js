const express = require('express');
const passport = require('passport');

const router = express.Router();

//Route to initiate Discord OAuth login
router.get('/login', passport.authenticate('discord'));

//Route to handle OAuth callback
router.get('/auth/callback', passport.authenticate('discord', {
  failureRedirect: '/login'
}), (req, res) => {
  try {
    console.log('User authenticated successfully:', req.user.id);
    res.redirect('/dashboard'); 
  } catch (error) {
    console.error('Error during authentication callback:', error);
    res.status(500).send('Internal Server Error');
  }
});

//Route to log out the user
router.post('/logout', (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error('Error during logout:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('User logged out successfully');
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).send('Internal Server Error');
        }
        res.redirect('/');
      });
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;