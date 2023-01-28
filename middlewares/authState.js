const isSignedIn = (req, res, next) => {
    var result = false
    const cookies = req.cookies
    if (cookies.userId != null && cookies.token != null)
        result = true

    res.locals.isSignedIn = result
    next()
}

module.exports = isSignedIn