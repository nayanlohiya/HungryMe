const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport) { //userfield below means we will be sarching provided email with the stored email in the database means searching criteria is email
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {//email,pass is recived from the login page and done is the callback
        // Login
        // check if email exists
        const user = await User.findOne({ email: email })//finding the user with the given email in the database
        if(!user) { //if user does not exists 
            return done(null, false, { message: 'No user with this email' })
        }

        bcrypt.compare(password, user.password).then(match => {//comparing password with the stored user password
            if(match) {
                return done(null, user, { message: 'Logged in succesfully' }) //if matched then in the middle of done we willl send the user in the callback
            }
            return done(null, false, { message: 'Wrong username or password' })
        }).catch(err => {
            return done(null, false, { message: 'Something went wrong' })
        })
    }))

    passport.serializeUser((user, done) => { //menas we will be storing in the session that the user is logged in and the storing criteria will be its id
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => { //this the id of the current loggedin user
        User.findById(id, (err, user) => {//finding this is in the database 
            done(err, user)//fisrt tyhing in the done is the error which we are giving null in all the above syntax
        })
    })

}

module.exports = init
//comp