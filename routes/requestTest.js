var express = require('express');
var request = require('request')
var router = express.Router();


router.get('/', function(req, res, next) {
  //쿼리로 loginId받아서, 로그인 api 찔러보기
  console.log(`(/req) ID = ${req.query.loginId}`)
  const options = {
    url: '',
    method: 'POST',
    json: true,
    body:{
      loginId: req.query.loginId
    }
  }
  request.post(options, function(err, response, body){
    console.log(`(/req) On Callback`)
    if(err)
      throw err
    res.send(body)
  })
});

module.exports = router;
