const mongoose = require('mongoose');

const momo = new mongoose.Schema({
    idhoadon : Array,
    partnerCode: String,
    orderId: String,
    requestId: String,
    amount: Number,
    orderInfo: String,
    orderType: String,
    transId: String,
    resultCode: Number,
    message: String,
    payType: String,
    responseTime: Number,
    extraData: String,
    signature: String
});

const Momo = mongoose.model('momo', momo);

module.exports = Momo;