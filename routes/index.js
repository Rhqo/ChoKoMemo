var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //로그인 된 상태이면, memo로 리다이렉트
  if(req.cookies.userId != null) {
    res.redirect("/memo")
    return
  }

  res.render('index', { title: 'ChoKoMemo' , showMemu:true});
});

module.exports = router;
