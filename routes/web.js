const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
// Middlewares ---->

//this is used so that if the user is alredy looged in then it is not allowed to go to login or register page
const guest = require('../app/http/middlewares/guest')
//this is used so that if the user is  looged in then only it is  allowed to go to the given routes
const auth = require('../app/http/middlewares/auth')
//this is used so that if the user is admin  then only it is  allowed to go to the given routes
const admin = require('../app/http/middlewares/admin')

function initRoutes(app) {
    app.get('/', homeController().index)
    app.get('/login',guest, authController().login)
    app.post('/login', authController().postLogin)//post req to the server to authenticate by login.ejs
    app.get('/register',guest, authController().register)
    app.post('/register', authController().postRegister)//post req to the server  by register.ejs
    app.post('/logout', authController().logout) //in layout.ejs

    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)//sending post req to the server for updating the cart
    
    // Customer routes
    app.post('/orders',auth, orderController().store) //this is post route sent by cart.ejs to store the orderes which we created in the database
    app.get('/customer/orders', auth, orderController().index) //this route is sent by cart.ejs to get the customer/orders page
    app.get('/customer/orders/:id', auth, orderController().show) //this the route of single order with order-id which is dynamic 

     // Admin routes
     app.get('/admin/orders', admin, adminOrderController().index)//calling this when we want to go to admin.orders route
     app.post('/admin/order/status', admin, statusController().update)//this is the post route on which we will go when change the status in the form of admin
}

module.exports = initRoutes
//comp
