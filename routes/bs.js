var express = require('express');
var request = require('request')
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('practice/bs_index')
});

router.get('/login', function(req, res, next) {
    res.render('practice/bs_login')
});

router.get('/memo', function(req, res, next) {
    res.render('practice/bs_memo')
})

module.exports = router;
