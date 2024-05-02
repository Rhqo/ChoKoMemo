# 온라인 메모장 ‘ChoKoMemo’

# 개요

---

🗓️ 기간: 23/1/1 ~ 23/2/29

🗂️ 사용 언어: `JavaScript` `HTML` `CSS`

💡 사용 프레임워크 및 엔진: `Node.js` `Bootstrap` `EJS`

🖋️ 한줄 요약: 언제 어디서든지 간편하게 메모할 수 있는, 로그인 기능을 추가한 온라인 메모장

# 프로젝트 소개

---

![1.png](/img/1.png)

방학기간동안 친구와 함께 공부 목적의 프로젝트를 진행하였습니다. 저희가 만든 ‘ChokoMemo’ 라는 온라인 메모장 웹 어플리케이션입니다. 

ChoKoMemo는 온라인에서 사용할 수 있는 메모장입니다. 사용자는 여러 개의 메모장을 만들고, 여러 개의 메모를 작성할 수 있습니다. 이 프로젝트는 프론트엔드와 백엔드 개발로 이루어집니다.

```markdown
.
├── app.js
├── bin
│   └── www
├── middlewares
│   ├── authState.js
│   └── errorHandler.js
├── package.json
├── package-lock.json
├── public
│   └── stylesheets
│       └── style.css
├── routes
│   ├── account.js
│   ├── createMemo.js
│   ├── index.js
│   ├── memoList.js
│   └── updateMemo.js
└── views
    ├── createMemo.ejs
    ├── error.ejs
    ├── footer.ejs
    ├── header.ejs
    ├── index.ejs
    ├── login.ejs
    ├── memo.ejs
    ├── signup.ejs
    └── updateMemo.ejs

5 directories, 21 files
```

프로젝트의 구조는 위와 같습니다. Nodejs의 Express 웹 프레임워크 사용하여 진행하였습니다. 프로젝트는 크게 회원가입, 로그인, 메모리스트 확인, 메모 생성, 메모 수정, 메모 삭제, 자동저장 기능이 구현되어 있습니다.

# 회원가입

---

## 스크린샷

![버튼이 비활성화 되었을 경우](/img/2.png)

버튼이 비활성화 되었을 경우

![버튼이 활성화 되었을 경우](/img/3.png)

버튼이 활성화 되었을 경우

Password와 Verify Password가 일치하지 않을 경우, 버튼이 비활성화 됩니다. 

## API Specification

### Signup

- 신규 회원가입
- /api/chokomemo/signup
    - `POST`
    - Requeest
        - **accountId**: `string`
        - **password**: `string`
        
        ```json
        { "accountId": "testId", "password": "password" }
        ```
        
    - Response
        - **error**: `any`, if error occured
        - **isSuccess**: `boolean`
        
        ```json
        { "isSuccess": true }
        // error{ "error": { "message": "..." }}
        ```
        

## 기능의 구현

```jsx
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
  })
```

POST 방식으로, string 형태의 ID와 Password를 JSON구조로 변환하여 서버로 요청하면, 서버에서는 성공했는지 여부를 boolean 형태로 보내줍니다. 만약 에러가 발생했다면, 에러메세지를 포함한 내용을 보내줍니다.

# 로그인

---

## 스크린샷

![4.png](/img/4.png)

## API Specification

### Singin

- 로그인 (Token 발행)
- /api/chokomemo/signin
    - `POST`
    - Request
        - **accountId**: `string`
        - **password**: `string`
        
        ```json
        { "accountId": "testId", "password": "password" }
        ```
        
    - Response
        - **error**: `any`, if error occured
        - **userId**: `string`
        - **token**: `string`
        
        ```json
        { "userId": "1234", "token": "temp_token" }
        // error{ "error": { "message": "..." } }
        ```
        

## 기능의 구현

```jsx
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
```

POST 방식으로, string 형태의 ID와 Password를 JSON구조로 변환하여 서버로 요청하면, 서버에서는 string형태의 userId와 token을 보내줍니다. 여기서 userId는 유저마다 부여된 고유번호이며, token은 사용자의 인증을 담당하는 문자열이며, 이 뒤의 서버와의 통신에서는 항상 이 2가지 요소를 활용합니다.

토큰 기반 인증을 활용하여, 토큰 유효 기간 동안, 사용자가 자격 증명을 다시 입력할 필요 없이, 자유롭게 본인의 메모에 접근할 수 있도록 구현하였습니다. 이 토큰을 Cookie에 저장하고, authState 미들웨어를 활용하여 지속적으로 사용자의 아이덴티티를 확인하였습니다. 

# 메모리스트 확인

---

## 스크린샷

![메모가 존재하지 않을 경우](/img/5.png)

메모가 존재하지 않을 경우

![메모가 존재할 경우](/img/6.png)

메모가 존재할 경우

## API Specification

### 전체 메모리스트 불러오기

### Get All Memo List

- 모든 메모 리스트 가져오기
- api/chokomemo/all-memos
    - `GET`
    - Request
        - **userId**: `string`,
        - **token**: `string`
        
        ```json
        {    "userId": "1234",    "token": "temp_token"}
        ```
        
    - Response
        - **error**: `any`, if error occured
        - **memoList** `array` of `memoListInfo`
            - **memoListInfo**: `object`
                - **memoId**: `number`
                - **title**: `string`
                - **updatedAt**: `datetime`
        
        ```json
        {    "memoList": [
                {   "memoId": 1,
                    "title": "memo-title",
                    "updatedAt": "2023-01-22T20:42:10+09:00"
                }    
        			]
        }
        // error{ "error": { "message": "..." } }
        ```
        

### 특정 메모 불러오기

### Get Memo

- 특정 메모 가져오기
- api/chokomemo/memo
    - `GET`
    - Request
        - **userId**: `string`,
        - **token**: `string`,
        - **memoId**: `number`
        
        ```json
        { "userId": "1234", "token": "temp_token", "memoId": 1}
        ```
        
    - Response
        - **error**: `any`, if error occured
        - **title**: `string`
        - **content**: `string`
        
        ```json
        { "title": "memo-title", "content": "blah blah" }
        // error{ "error": { "message": "..." }}
        ```
        

## 기능의 구현

### 전체 메모리스트 불러오기

```jsx
const getAllMemoOptions = {
    url: 'http://server.chokospace.kro.kr:3901/api/chokomemo/all-memos',
    method: 'GET',
    json: true,
    body:{
      userId: cookies.userId,
      token: cookies.token
    }
  }

request.get(getAllMemoOptions, function(err, response, body){
    if(err){
      throw err
    }

    if(req.query.id != null) {
      numMemoID = parseInt(req.query.id)
      responseWithSpecificMemoDetail(req, res, next, body.memoList, numMemoID)
    } else {
      if(body.memoList != null) {
        res.redirect(`/memo?id=${body.memoList[0].memoId}`)
      } else {
        //메모가 하나도 없는 경우
        detail = new_memoDetailObj(-1, "새로운 메모를 만들어 보세요!", "이곳에 내용을 보여드릴게요.")
        res.render('Memo', { title:"Memo", memoList:null, memoDetail:detail, showAccountOptions:true, isSignedIn:true });
      }
    }
  })
```

### 특정 메모 불러오기

```jsx
function responseWithSpecificMemoDetail(req, res, next, memoList, memoId) {
  const cookies = req.cookies

  //바로 보여줄 메모의 디테일 정보를 가져온다.
  const getSpecificMemoOptions = {
    url: 'http://server.chokospace.kro.kr:3901/api/chokomemo/memo',
    method: 'GET',
    json: true,
    body:{
      userId: cookies.userId,
      token: cookies.token,
      memoId: memoId
    }
  }

  request.get(getSpecificMemoOptions, function(err, response, body) {
    if(err){
      throw err
    }
    
    if(body.error != null)
    {
      res.render(body.error.message)
    } else {
      resBody = JSON.parse(response.request.body)
      detail = new_memoDetailObj(resBody.memoId, body.title, body.content)
      res.render('Memo', { title:"Memo", memoList:memoList, memoDetail:detail, showAccountOptions:true, isSignedIn:true });
    }
  })
}
```

GET 방식으로, string 형태의 userId와 token을 JSON구조로 변환하여 서버로 요청하면, 서버에서는 전체 메모의 리스트를 배열 형태로 응답합니다. 배열 속의 memoListInfo 객체는, 메모의 Id와 제목 그리고 마지막 수정날짜 정보로 이루어져 있습니다. 

불러온 memoList 배열은 메모리스트 페이지의 왼쪽 사이드바에 표시됩니다. 왼쪽에 표시된 메모에서는 그 제목과 마지막 수정 날짜를 보여줍니다.

GET 방식으로, string 형태의 userId, token과 number 형태의 memoId를 JSON구조로 변환하여 서버로 요청하면, 서버에서는 그 메모의 제목과 내용을 string으로 응답합니다. 

불러온 메모의 제목과 내용은 페이지의 오른쪽 면에 표시됩니다.

# 메모 생성

---

## 스크린샷

![7.png](/img/7.png)

## API Specification

### Create Memo

- 새로운 메모 생성
- /api/chokomemo/memo
    - `POST`
    - Request
        - **userId**: `string`
        - **token**: `string`
        - **title**: `string`
        - **content**: `string`
        
        ```json
        { "userId": "1234", "token": "temp_token", "title": "memo-title", "content": "blah blah" }
        ```
        
    - Response
        - **error**: `any`, if error occured
        - **isSuccess**: `boolean`
        - **memoId**: `number`
        
        ```json
        { "isSuccess": true, "memoId": 1,}
        // error{ "error": { "message": "..." } }
        ```
        

## 기능의 구현

```jsx
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
```

POST 방식으로, string 형태의 userId와 token을 JSON구조로 변환하여 서버로 요청하면, 서버는 새 메모가 성공적으로 저장되었는지 여부와, 새로 생성된 memo의 Id를 각각 boolean과 number형태로 응답합니다.

# 메모 수정

---

### 스크린샷

![8.png](/img/8.png)

## API Specification

### Update Memo

- 기존 메모 수정
- /api/chokomemo/memo
    - `PUT`
    - Request
        - **userId**: `string`
        - **token**: `string`
        - **memoId**: `number`
        - **title**: `string`
        - **content**: `string`
        
        ```json
        { "userId": "1234", "token": "temp_token", "memoId": 1, "title": "memo-title", "content": "blah blah"}
        ```
        
    - Response
        - **error**: `any`, if error occured
        - **isSuccess**: `boolean`
        
        ```json
        { "isSuccess": true }
        // error{ "error": { "message": "..." } }
        ```
        

## 기능의 구현

```jsx
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
          alert("메모 저장에 실패했습니다.", `/updateMemo?id=${memoId}`, res);
          return
      }
      else {
          alert("성공적으로 저장되었습니다.", `/memo`, res);
      }
  })
  .catch(error => {
      console.error(error);
  });
```

PUT 방식으로, string 형태의 userId, token, 제목, 내용과 number 형태의 memoId를 JSON구조로 변환하여 서버로 요청하면, 서버는 성공적으로 저장되었는지 여부를 boolean 형태로 응답합니다.

# 메모 삭제

---

## API Specification

### Delete Memo

- 기존 메모 삭제
- /api/chokomemo/memo
    - `DELETE`
    - Request
        - **userId**: `string`
        - **token**: `string`
        - **memoIds**: `array` of `number`
        
        ```json
        { "userId": "1234", "token": "temp_token", "memoIds": [1, 2, 3] }
        ```
        
    - Response
        - **error**: `any`, if error occured
        - **deletedMemoIds**: `array` of `number`
        
        ```json
        { "deletedMemoIds": [1, 2, 3] }
        // error{ "error": { "message": "..." } }
        ```
        

## 기능의 구현

```jsx
fetch('http://server.chokospace.kro.kr:3901/api/chokomemo/memo', {
      credentials: 'omit',
      method: 'Delete',
      body: requestBody,
      headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
      response = JSON.stringify(data);
      if (err = response.error){
          alert("메모 삭제에 실패했습니다.", "/memo", res);
          return
      }
      else {
          alert("메모 삭제에 성공했습니다.", "/memo", res);
      }
  })
  .catch(error => {
      console.error(error);
  });
```

DELETE 방식으로, string 형태의 userId, token과 number의 배열 형태로 삭제할 메모의 Id들을 JSON구조로 변환하여 서버로 요청하면, 서버는 삭제된 메모의 Id들을 number의 배열 형태로 응답합니다.

# 자동 저장

---

## Logic

```jsx
//3분동안 입력 없을 시 
var writingTime = new Date();
document.getElementById('content').addEventListener('input', (evt)=>{
    writingTime = new Date();
});
function checkAFK() {
    console.log("checkAFK")
    const currentTime = new Date();
    const afkTime = currentTime - writingTime;
    const allowedTimes = 60000 * 3; //3min
    if(afkTime > allowedTimes){
        memoIdField = document.getElementById("memoId");
        titleField = document.getElementById("title");
        contentField = document.getElementById("content");
        fetch('/updateMemo/autosave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: memoIdField.value,
                title: titleField.value,
                content: contentField.value
            })
        });
    }
}
setInterval(checkAFK, 60000); //1분마다 확인
```

## 기능의 구현

```jsx
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
          console.log("메모 저장에 실패했습니다.");
          return
      }
      else {
          console.log("자동저장 완료");
      }
  })
  .catch(error => {
      console.error(error);
  });
```

자동저장 기능은 3분동안 아무 입력이 없을 경우 메모 수정 기능의 API를 활용하여 통신하도록 구성하였습니다.

## GitHub Link

---

[https://github.com/ChoKoSpace/ChoKoMemo.git](https://github.com/ChoKoSpace/ChoKoMemo.git)
