document.getElementById('deleteBtn').addEventListener('click', (evt)=>{
    const cookies = document.cookie.split(';');
    var cookieList = [];
    cookies.forEach(cookie => {
    const [name, value] = cookie.split('=');
    cookieList.push(value);
    });

    const userId = cookieList[0];
    const token = cookieList[1];
    const memoIds = document.getElementById('memoIds').value;
    
    const string = `{"userId": "${userId}","token": "${token}","memoIds": ${memoIds}}`;
    const jsonObject = JSON.parse(string);

    fetch('http://server.chokospace.kro.kr:3901/api/chokomemo/memo', {
        credentials: 'omit',
        method: 'Delete',
        body: JSON.stringify(jsonObject),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        response = JSON.stringify(data);
        if (err = response.error){
            alert(err)
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