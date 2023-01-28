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

  var memoList = null

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

    if(body.memoList == null)
    {
      res.send("메모가 없다!") //TODO: 없으면 없는대로 페이지 렌더
      return
    } else {
      memoList = body.memoList

      //바로 보여줄 메모의 디테일 정보를 가져온다.
      const getSpecificMemoOptions = {
        url: 'http://server.chokospace.kro.kr:3901/api/chokomemo/memo',
        method: 'GET',
        json: true,
        body:{
          userId: cookies.userId,
          token: cookies.token,
          memoId: memoList[0].memoId
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

          res.render('Memo', { title:"Memo", showMenu:true, memoList:memoList, memoDetail:detail });
        }
      })
    }
  })
  /*



  //서버에서 받아온 값을 맵으로 정리
  let memoMap = new Map();
  for (idx in memoList) {
    memo = memoList[idx]
    newMemo = {
      title: memo.title,
      content: `memoID: ${memo.memoId}`
     }
     memoMap.set(memo.memoId, newMemo) 
  }

  //쿼리 데이터가 string이고, 맵 id는 number라서 맵 뒤질려면 int로 컨버팅!
  numberID = parseInt(req.query.id)
  //맵에 있는지 확인
 if (memoMap.has(numberID)) {
    thisMemo = memoMap.get(numberID)
    
    memoDetail.memoId = req.query.id
    memoDetail.title = thisMemo.title
    memoDetail.content = thisMemo.content
  }

  res.render('Memo', { title:"Memo", showMenu:true, memoList:memoList, memoDetail:memoDetail });
  */
});

module.exports = router;
