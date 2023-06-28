const order = require("../../../models/order")

const Order = require('../../../models/order')

function orderController() {
    return {
        index(req, res) {
            //$ne means we have to show only those orders which are not completed sorted in created time 
           order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).
           populate('customerId', '-password').exec((err, orders) => {//populate menas we will get all the details of the customer with this cus_id  and not simply the id of the customer
               if(req.xhr) { 
                   return res.json(orders)
               } else {
                return res.render('admin/orders')//this is for if the user entered the direct url then go to this page
               }
           })
        }
    }
}

module.exports = orderController
//comp