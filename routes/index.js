var express = require('express');
var router = express.Router();
const userModel = require('./users.js');
const postModel = require('./posts.js');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});

router.get('/login', (req, res, next) => {
  res.render('login.ejs');
});
router.get('/feed', (req, res, next) => {
  res.render('feed.ejs');
});

router

router.get("/profile", isLoggedIn, async (req, res) => {
  res.render('profile.ejs');
});

router.post("/register", async (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });
  userModel.register(userData, req.body.password,).then(
    (user) => {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/profile');
      });
    })
});

router.post("/login", passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
}), async (req, res) => {
  res.redirect('/profile');
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;