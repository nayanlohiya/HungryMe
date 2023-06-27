//this is used so that if the user is alredy looge in then it is not allowed to go to login or register page

function guest (req, res, next) {
    if(!req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/')
}

module.exports = guest
//comp