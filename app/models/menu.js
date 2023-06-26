const mongoose = require('mongoose')
const Schema = mongoose.Schema //capital means we are using class or the constructor of mongoose

const menuSchema = new Schema({ //scheme which we want in the front end and will be stored in the database
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true }
})

module.exports = mongoose.model('Menu', menuSchema) //if declaring Menu then plural will be there in the data base
//comp