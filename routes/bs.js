var express = require('express');
var request = require('request')
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('practice/bs_body')
});

router.get('/login', function(req, res, next) {
    res.render('practice/bs_login')
});

module.exports = router;
