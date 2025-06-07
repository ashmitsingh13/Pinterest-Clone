var express = require('express');
var router = express.Router();
const userModel = require('./users.js');
const postModel = require('./posts.js');
const passport = require('passport');
const upload = require('./multer.js');


const localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});

router.get('/login', (req, res, next) => {
  res.render('login.ejs', { error: req.flash('error') });
});
router.get('/feed', (req, res, next) => {
  res.render('feed.ejs');
});

router.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    image: req.file.filename,
    user: user._i
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
})

router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate('posts');
  res.render('profile.ejs', { user });
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
  failureFlash: true
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