//this is used so that if the user is  looged in then only it is  allowed to go to the given routes

function auth(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/login')
}

module.exports = auth
//comp