var express = require('express');
var router = express.Router();

/* GET list page. */
router.get('/', function(req, res, next) {
  //밑에서 사용하는 데이터들은 모두 DB에서 읽어와야 한다.

  //왼쪽 리스트에 작성될 메모 타이틀 리스트
  memoList = [
    { title: 'Memo1', memoId:1 },
    { title: 'Memo2', memoId:2 },
    { title: 'Memo3', memoId:3 },
    { title: 'Memo4', memoId:4 },
    { title: 'Memo5', memoId:5 }
  ]

  //todo: 구조체로 빼서 사용
  memoDetail = {
    memoId: -1,
    title: `no memo`,
    content: `default`
  }

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
});

module.exports = router;
