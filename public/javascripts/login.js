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
        alert(JSON.stringify(data))
    })
    .catch(error => {
        alert(error)
        console.error(error);
    });
    //창 넘어가지 않도록
    evt.preventDefault();
});