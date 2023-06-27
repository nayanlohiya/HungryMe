const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')


// Middlewares 
const guest = require('../app/http/middlewares/guest')

function initRoutes(app) {
    app.get('/', homeController().index)
    app.get('/login',guest, authController().login)
    app.post('/login', authController().postLogin)//post req to the server to authenticate
    app.get('/register',guest, authController().register)
    app.post('/register', authController().postRegister)//post req to the server 
    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)//sendinf post req to the server for updating the cart

}

module.exports = initRoutes
