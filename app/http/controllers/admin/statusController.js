const Order = require('../../../models/order') //requring order from the db for upadting the status 

function statusController() {
    return {
        update(req, res) {
            //here we are updating the status with the help of order-idwhich we are gettinh when we click on form in order.ejs in admin folder
            Order.updateOne({_id: req.body.orderId}, { status: req.body.status }, (err, data)=> {
                if(err) {
                    return res.redirect('/admin/orders') //if error redirect to thispage
                }
                return res.redirect('/admin/orders') //if all correct redirect to this page
            })
        }
    }
}

module.exports = statusController