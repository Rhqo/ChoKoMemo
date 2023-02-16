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

function alert(string, path, res) {
  res.write('<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>')
  res.write(`<script>alert("${string}")</script>`);
  res.write(`<script>window.location=\"${path}\"</script>`);
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

router.post('/', function(req, res, next) {
  const title = req.body.title;
  const content = req.body.content;
  const memoId = parseInt(req.body.id);

  const cookies = req.cookies;
  const userId = cookies.userId;
  const token = cookies.token;
  
  const string = `{"userId": "${userId}","token": "${token}","memoId": ${memoId},"title": "${title}","content": "${content}"}`;

  fetch('http://server.chokospace.kro.kr:3901/api/chokomemo/memo', {
      credentials: 'omit',
      method: 'PUT',
      body: string,
      headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
      response = JSON.stringify(data);
      if (err = response.error){
          alert("메모 저장에 실패했습니다.", `/updateMemo?id=${memoId}`, res);
          return
      }
      else if (cookies.isAutoSaved) {
        res.clearCookie('isAutoSaved', { path: '/'});
        res.redirect(`/updateMemo?id=${memoId}`);
      }
      else {
          alert("성공적으로 저장되었습니다.", `/memo`, res);
      }
  })
  .catch(error => {
      console.error(error);
  });
});

router.post('/autosave', function(req, res, next) {
  const title = req.body.title;
  const content = req.body.content;
  const memoId = parseInt(req.body.id);

  const cookies = req.cookies;
  const userId = cookies.userId;
  const token = cookies.token;
  
  const string = `{"userId": "${userId}","token": "${token}","memoId": ${memoId},"title": "${title}","content": "${content}"}`;
  console.log("[AutoSave]" + string);
  
  fetch('http://server.chokospace.kro.kr:3901/api/chokomemo/memo', {
      credentials: 'omit',
      method: 'PUT',
      body: string,
      headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
      response = JSON.stringify(data);
      if (err = response.error){
          console.log("메모 저장에 실패했습니다.");
          return
      }
      else {
          console.log("자동저장 완료");
      }
  })
  .catch(error => {
      console.error(error);
  });
});

module.exports = router;

