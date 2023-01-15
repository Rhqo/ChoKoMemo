var express = require('express');
var router = express.Router();

router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'Signup' , showMemu:false});
  });

router.get('/signin', function(req, res, next) {
    res.render('login', { title:"Signin", showMenu:false });
});

module.exports = router;
