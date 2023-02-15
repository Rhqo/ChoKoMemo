var express = require('express');
var router = express.Router();

function alert(string, path, res) {
    res.write('<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>')
    res.write(`<script>alert("${string}")</script>`);
    res.write(`<script>window.location=\"${path}\"</script>`);
}

router.get('/', function(req, res, next) {
    res.render('createMemo', { showAccountOptions:true, isSignedIn:res.locals.isSignedIn });
});

router.post('/', function(req, res, next) {
    const title = req.body.title;
    const content = req.body.content;

    const cookies = req.cookies;
    const userId = cookies.userId;
    const token = cookies.token;

    fetch('http://server.chokospace.kro.kr:3901/api/chokomemo/memo', {
        credentials: 'omit',
        method: 'POST',
        body: JSON.stringify({ userId, token, title, content }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        response = JSON.stringify(data);
        if (err = response.error){
            alert("메모 저장에 실패했습니다.", "/memo", res);
            return
        }
        else {
            alert("성공적으로 저장되었습니다.", "/memo", res);
        }

        res.redirect('/memo');
    })
    .catch(error => {
        console.error(error);
    });

}); 

module.exports = router;

