form = document.getElementsByClassName('memo-form')
form[0].addEventListener('submit', (evt)=>{
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const cookies = document.cookie.split(';');
    var cookieList = [];
    cookies.forEach(cookie => {
    const [name, value] = cookie.split('=');
    cookieList.push(value);
    });

    const userId = cookieList[0];
    const token = cookieList[1];

    fetch('http://server.chokospace.kro.kr:3901/api/chokomemo/memo', {
        credentials: 'omit',
        method: 'POST',
        body: JSON.stringify({ userId, token, title, content }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        response = JSON.stringify(data);
        alert(response);
        if (err = response.error){
            alert("error")
            return
        }
        else {
            alert("success")
        }

        window.location="/memo"
    })
    .catch(error => {
        alert(error)
        console.error(error);
    });
    //페이지 넘어가지 않도록
    evt.preventDefault();
});