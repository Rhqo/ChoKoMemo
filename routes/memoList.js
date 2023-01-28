var express = require('express');
var request = require('request')
var router = express.Router();

function memoDetailObj(){
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
  const cookies = req.cookies

  //TODO: 쿠키에 원하는 정보가 있는지 확인하는 절차가 필요하다.

  const getAllMemoOptions = {
    url: 'http://server.chokospace.kro.kr:3901/api/chokomemo/all-memos',
    method: 'GET',
    json: true,
    body:{
      userId: cookies.userId,
      token: cookies.token
    }
  }

  request.get(getAllMemoOptions, function(err, response, body){
    if(err){
      throw err
    }

    //TODO: 응답에 에러 메세지가 있고, 그 메세지가 Invalid User일때 처리가 필요하다.
    //      현재 다른 에러는 따로 처리계획이 없다. 이것도 해결이 필요한 문제
    if(body.error != null){
      if(body.error.message.includes("Invalid token")){
        //TODO: 아래와 같은, 특정 에러에 대한 대처로직은 모든 페이지에 공통으로 적용된다.
        //      이 코드들을 한 곳에 모아서 처리하도록 만들자.
        
        //쿠키 제거
        res.clearCookie("userId")
        res.clearCookie("token")

        //알람 띄우고 메인페이지로 이동
        res.write('<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>') //alert 한글 깨짐방지
        res.write("<script>alert('장시간 활동이 없어 자동으로 로그아웃 되었습니다.')</script>");
        res.write("<script>window.location=\"/\"</script>");
        return
      }
    }

    if(req.query.id != null) {
      numMemoID = parseInt(req.query.id)
      responseWithSpecificMemoDetail(req, res, next, body.memoList, numMemoID)
    } else {
      if(body.memoList != null) {
        res.redirect(`/memo?id=${body.memoList[0].memoId}`)
      } else {
        //메모가 하나도 없는 경우
        detail = new_memoDetailObj(-1, "새로운 메모를 만들어 보세요!", "이곳에 내용을 보여드릴게요.")
        res.render('Memo', { title:"Memo", memoList:null, memoDetail:detail, showAccountOptions:true, isSignedIn:true });
      }
    }
  })
});

function responseWithSpecificMemoDetail(req, res, next, memoList, memoId) {
  const cookies = req.cookies

  //바로 보여줄 메모의 디테일 정보를 가져온다.
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
      res.render('Memo', { title:"Memo", memoList:memoList, memoDetail:detail, showAccountOptions:true, isSignedIn:true });
    }
  })
}

module.exports = router;
