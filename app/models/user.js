const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' } //becoz here 2 types of people can access customer and admin so we are using role
}, { timestamps: true }) //to know when the user is registerd that is time and date

module.exports = mongoose.model('User', userSchema) //model is singluar and collection created in the database will be pluaral