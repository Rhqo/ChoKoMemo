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

  //오른쪽 메인 콘텐츠창에 작성될 현재 메모 디테일
  memoDetail = {
    memoId: req.query.id,
    title: `Memo${req.query.id}`,
    content: `This is content of Memo${req.query.id}`
  }

  res.render('Memo', { title:"Memo", showMenu:true, memoList:memoList, memoDetail:memoDetail });
});

module.exports = router;
