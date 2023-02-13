var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    res.render('createMemo', { showAccountOptions:true, isSignedIn:res.locals.isSignedIn });
});

module.exports = router;

