var express = require('express');
var router = express.Router();

router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'Signup' , showAccountOptions:false});
  });

router.get('/signin', function(req, res, next) {
    res.render('login', { title:"Signin", showAccountOptions:false });
});

router.get('/signout', function(req, res, next) {
  res.clearCookie("userId")
  res.clearCookie("token")
  res.redirect("/")
});

module.exports = router;
