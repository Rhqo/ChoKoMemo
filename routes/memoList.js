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

  const options = {
    url: 'http://server.chokospace.kro.kr:3901/api/chokomemo/all-memos',
    method: 'GET',
    json: true,
    body:{
      userId: cookies.userId,
      token: cookies.token
    }
  }

  request.get(options, function(err, response, body){
    if(err){
      throw err
    }

    //TODO: 응답에 에러 메세지가 있고, 그 메세지가 Invalid User일때 처리가 필요하다.
    //      현재 다른 에러는 따로 처리계획이 없다. 이것도 해결이 필요한 문제
    if(body.error != null){
      if(body.error.message.includes("Invalid token")){
        //알람 띄우고 메인페이지로 이동
        res.write("<script>alert('token expired!')</script>");
        res.write("<script>window.location=\"/\"</script>");
        return
      }
    }

    if(body.memoList == null)
    {
      res.send("메모가 없다!") //TODO: 없으면 없는대로 페이지 렌더
      return
    } else {
      const memoList = body.memoList

      //js에서는 함수를 객체로 사용한다.
      //typescript를 사용하면, interface를 통해 조금 더 익숙한 형태의 객체를 볼 수 있다.
      //typescript쓸까?
      detail = new_memoDetailObj(-1, "title", "contenct")

      res.render('Memo', { title:"Memo", showMenu:true, memoList:memoList, memoDetail:detail });
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
