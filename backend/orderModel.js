const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    items: {type: Array, required: true},
    amount: {type: Object, required: true},
    addressL1: {type: Object, required: true},
    country: {type: Object, required: true},
    city: {type: Object, required: true},
    stateProv: {type: Object, required: true},
    postalCode: {type: Object, required: true},
    payMethod: {type: Object, required: true},
    status: {type: String, required: true, default: 'Order Placed'},
    date: {type: Number, required: true}
})
const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel;