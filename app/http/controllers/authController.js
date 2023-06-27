const User = require('../../models/user')//requring the user model
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController() {
    return {
         login(req, res) {
            return res.render('auth/login') 
        },
        postLogin(req, res, next) {
            const { email, password }   = req.body
           // Validate request 
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => { //using passport.authenticate method which returs a function (doubtful but yes it does)
                if(err) {                  //same parameters passed by done in passport.js recieved here
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) { //user does not exists
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => { //calling Login method
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }

                    return res.redirect('/') //redirecting to oreder page
                })
            })(req, res, next)//returning fn of .authenticate method
        },
        register(req, res) {
            return res.render('auth/register') 
        },
        async postRegister(req, res) {
            const { name, email, password }   = req.body
            // Validate request 
            if(!name || !email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('name', name) //flash the name when fiels are not filled and sent it to register.ejs to show
                req.flash('email', email)
               return res.redirect('/register')
            }
   
            // Check if email exists 
            User.exists({ email: email }, (err, result) => { 
                if(result) { // if the user is fount then we will display these things
                   req.flash('error', 'Email already taken')
                   req.flash('name', name)
                   req.flash('email', email) 
                   return res.redirect('/register')
                }
            })

         // Hash password 
         const hashedPassword = await bcrypt.hash(password, 10)
         // Create a user 
         const user = new User({ //creating the new user with the password as hashed password which will be stored in the database
             name,
             email,
             password: hashedPassword
         })
          
         //saving the user in the database if it does not already exists
         user.save().then((user) => {
            // Login
            return res.redirect('/') //registered user will be redirected to the home page
         }).catch(err => {
            req.flash('error', 'Something went wrong')//if some thing went wrong the redirct to the register page
                return res.redirect('/register')
         })
        },
        logout(req, res) { //craeting  the logout method
            req.logout()
            return res.redirect('/login')  
        }

    }
}


module.exports = authController
//comp