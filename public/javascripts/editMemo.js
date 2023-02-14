create = document.getElementsByClassName('memo-form')
create[0].addEventListener('submit', (evt)=>{
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const memoId = document.getElementById('memoId').value;

    const cookies = document.cookie.split(';');
    var cookieList = [];
    cookies.forEach(cookie => {
    const [name, value] = cookie.split('=');
    cookieList.push(value);
    });

    const userId = cookieList[0];
    const token = cookieList[1];
    
    const string = `{"userId": "${userId}","token": "${token}","memoId": ${memoId},"title": "${title}","content": "${content}"}`;

    fetch('http://server.chokospace.kro.kr:3901/api/chokomemo/memo', {
        credentials: 'omit',
        method: 'PUT',
        body: string,
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        response = JSON.stringify(data);
        if (err = response.error){
            alert("error")
            return
        }
        else {
            alert(response)
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
