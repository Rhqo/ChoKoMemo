form = document.getElementsByClassName('register-form')
form[0].addEventListener('submit', (evt)=>{
    const accountId = document.getElementById('floatingInput').value;
    const password = document.getElementById('floatingPassword1').value;
    
    fetch('', {
        credentials: 'omit',
        method: 'POST',
        body: JSON.stringify({ accountId, password }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        response = JSON.parse(JSON.stringify(data))
        if (err = response.error){
            if(err.message == "Invalid ID"){
                alert("이미 존재하는 아이디입니다")
            }
            return
        }
        else {
            alert("성공적으로 가입되었습니다.")
        }

        //메인페이지로 이동
        window.location="/"
    })
    .catch(error => {
        alert(error)
        console.error(error);
    });
    //페이지 넘어가지 않도록
    evt.preventDefault();
});