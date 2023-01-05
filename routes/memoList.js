var express = require('express');
var router = express.Router();

/* GET list page. */
router.get('/list', function(req, res, next) {
  res.render('list', { title: 'ChoKoMemo' });
});

module.exports = router;
