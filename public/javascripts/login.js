form = document.getElementsByClassName('login-form')
form[0].addEventListener('submit', (evt)=>{
    const accountId = document.getElementById('id').value;
    const password = document.getElementById('password').value;

    
    fetch('http://server.chokospace.kro.kr:3901/api/chokomemo/signin', {
        credentials: 'omit',
        method: 'POST',
        body: JSON.stringify({  accountId, password }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        response = JSON.parse(JSON.stringify(data))
        if (err = response.error){
            //나중에 에러코드로 관리 해야겠다.
            if(err.message == "Invalid user"){
                alert("계정정보가 일치하지 않습니다.")
            }
            return
        }

        //쿠키 저장
        // const now = new Date();
        // const expirationTime = now.setTime(now.getTime() + (60 * 60 * 24));
        document.cookie = `userId=${response.userId}; path=/;`
        document.cookie = `token=${response.token}; path=/;`

        //메인페이지로 이동
        window.location="/memo"
    })
    .catch(error => {
        alert(error)
        console.error(error);
    });
    //페이지 넘어가지 않도록
    evt.preventDefault();
});