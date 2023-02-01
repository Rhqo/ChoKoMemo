/*
> 서버랑 연결이 안되는 경우, 서버랑 db랑 연결이 안되는 경우
> 로그인 안한상태에서 memo에 직접 들어가거나 로그인 안한상태에서 없는 memo 들어가는 경우
> 로그인 한 상태에서 없는 memo에 들어가는 경우
생성만했음
*/

const errorHandler = (req, res, next) => {



    next()
}

module.exports = errorHandler

