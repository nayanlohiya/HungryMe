const Order = require('../../../models/order')
const moment = require('moment')//this lib is used to play with time and date 

function orderController () {
    return {
        store(req, res) {
            // Validate request
            const { phone, address } = req.body
            if(!phone || !address) {
                 req.flash('error', 'All Feilds Required')
                 return res.redirect('/cart')
            }

            const order = new Order({  //creating the order object which contains all the thing which were there in the order model
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            order.save().then(result => {
                req.flash('success', 'Order Placed Successfully')
                delete req.session.cart 
                 return res.redirect('/customer/orders')
            }).catch(err => {
                req.flash('error', 'Something Went Wrong')
                return res.redirect('/cart')
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },//fetching all the orders of the logged in user from the database by matching customer_id
                null,
                { sort: { 'createdAt': -1 } } ) //here we are sorting acc to time 
            res.header('Cache-Control', 'no-store')//this is so that when we go backward from front then the green alert should not appear again and again
            res.render('customers/orders', { orders: orders, moment: moment })//sending the orders which we recienved from db to the frontend in orders.ejs
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id) //finding all the doc from the db with the help of id which is provided by route when we click on it
            // Authorize user means order of only that customer will be shown who has placed that order
            //toString is used so that both the object can be compared
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return  res.redirect('/')
        }
    }
}

module.exports = orderController
