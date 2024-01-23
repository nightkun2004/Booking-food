const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: String,
    bookingDate: String,
    menus: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    foodid: String,
    cuisine: String,
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)
module.exports = Restaurant;