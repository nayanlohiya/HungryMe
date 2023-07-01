const Order = require('../../../models/order') //requring order from the db for upadting the status 

function statusController() {
    return {
        update(req, res) {
            //here we are updating the status with the help of order-idwhich we are gettinh when we click on form in order.ejs in admin folder
            Order.updateOne({_id: req.body.orderId}, { status: req.body.status }, (err, data)=> {
                if(err) {
                    return res.redirect('/admin/orders') //if error redirect to thispage
                }
                 // Emit event 
                 const eventEmitter = req.app.get('eventEmitter')//using app where we have configured emitter
                 eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })//sending orderid and status to server.js to emit
                return res.redirect('/admin/orders') //if all correct redirect to this page
            })
        }
    }
}

module.exports = statusController