const mongoose = require("mongoose");

// Schema cho tổng hợp thống kê
const statisticsSchema = new mongoose.Schema({
    date: { type: String}, 
    newShops: { type: Number, default: 0 }, 
    newUsers: { type: Number, default: 0 }, 
    totaltransaction : { type: Number, default: 0 }, 
    totalregister : {type : Number , default : 0},
    revenue : {type : Number , default : 0},
    dailyOrders: { type: Number, default: 0 }, 
    codetransaction : {type : Array , default : []}
});

// Model cho tổng hợp thống kê
const Statistics = mongoose.model('Statistics', statisticsSchema);

module.exports = Statistics;