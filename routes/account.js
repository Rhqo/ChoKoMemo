var express = require('express');
var router = express.Router();

function alert(string, path, res) {
  res.write('<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>')
  res.write(`<script>alert("${string}")</script>`);
  res.write(`<script>window.location=\"${path}\"</script>`);
}

router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'Signup' , showAccountOptions:false});
});

router.post('/signup', function(req, res, next){
  const accountId = req.body.floatingInput;
  const password = req.body.floatingPassword1;
    
  fetch('http://server.chokospace.kro.kr:3901/api/chokomemo/signup', {
      credentials: 'omit',
      method: 'POST',
      body: JSON.stringify({ accountId, password }),
      headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
      response = data
      if (err = response.error){
        alert("사용할 수 없는 아이디입니다.", "/account/signup", res);
        return
      }
      else {
        alert("성공적으로 가입되었습니다.", "/", res);
      }
  })
  .catch(error => {
      console.error(error);
  });
})

router.get('/signin', function(req, res, next) {
    res.render('login', { title:"Signin", showAccountOptions:false });
});

router.post('/signin', function(req, res, next) {
  const accountId = req.body.floatingInput;
  const password = req.body.floatingPassword;

  fetch('http://server.chokospace.kro.kr:3901/api/chokomemo/signin', {
    credentials: 'omit',
    method: 'POST',
    body: JSON.stringify({ accountId, password }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    response = JSON.parse(JSON.stringify(data))
    if (err = response.error){
        //나중에 에러코드로 관리 해야겠다.
        if(err.message == "Invalid user"){
          alert("계정정보가 일치하지 않습니다.", "/account/signin", res);
        }
        return
    }
    
    res.cookie('userId', `${response.userId}`, { path: '/'})
    res.cookie('token', `${response.token}`, { path:'/' })

    //메인페이지로 이동
    res.redirect('/memo')
  })
  .catch(error => {
      console.error(error);
  });
});

router.get('/signout', function(req, res, next) {
  res.clearCookie("userId")
  res.clearCookie("token")
  res.redirect("/")
});

module.exports = router;
