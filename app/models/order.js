const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    customerId: {
                type: mongoose.Schema.Types.ObjectId,//here we are linking order model with the user model so as to get order_id from it
                ref: 'User', //giving the ref of User
                required: true //obvious
                },
    items: { type: Object, required: true },//this we will be getting from the session which has the key as items which is basically a object
    phone: { type: String, required: true},
    address: { type: String, required: true},
    paymentType: { type: String, default: 'COD'},//default cash on delivery
    paymentStatus: { type: Boolean, default: false },
    status: { type: String, default: 'order_placed'},
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)