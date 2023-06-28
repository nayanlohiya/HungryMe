function admin (req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'admin') {
        return next()
    }
    return res.redirect('/')//redirect to the home page
}

module.exports = admin
//comp