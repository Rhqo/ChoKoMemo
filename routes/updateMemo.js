var express = require('express');
var router = express.Router();
var request = require('request');

function memoDetailObj() {
    var memoId
    var title
    var content
}
  
function new_memoDetailObj(memoId, title, content){
    var ret = new memoDetailObj()
    ret.memoId = memoId
    ret.title = title
    ret.content = content
    return ret
}

router.get('/', function(req, res, next) {
    const cookies = req.cookies;
    const memoId = parseInt(req.query.id);

    const getSpecificMemoOptions = {
        url: 'http://server.chokospace.kro.kr:3901/api/chokomemo/memo',
        method: 'GET',
        json: true,
        body:{
          userId: cookies.userId,
          token: cookies.token,
          memoId: memoId
        }
      }
    
      request.get(getSpecificMemoOptions, function(err, response, body) {
        if(err){
          throw err
        }
        
        if(body.error != null)
        {
          res.render(body.error.message)
        } else {
          resBody = JSON.parse(response.request.body)
          detail = new_memoDetailObj(resBody.memoId, body.title, body.content)
          res.render('updateMemo', { memoDetail:detail, showAccountOptions:true, isSignedIn:true });
        }
      })
});

module.exports = router;

