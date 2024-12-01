const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho bảng hóa đơn
const InvoiceSchema = new Schema({
    iduser: { type: String}, 
    idshop : {type : String},
    fullName : {type : String},
    total: { type: Number },
    revenue : {type : Number , default : 0},
    Phone: { type: String }, 
    status : {type : Number , default : 0},
    checked : {type : String , default : false},
    orderStatus: { type: String , default : "Waiting for Confirmation" }, 
    orderDate: { type: Date, default: Date.now }, 
    paymentMethod: { type: String} ,
    address: String,
    City : String,
    Time : String,
    Timecomplete : {
        type : String,
        default : null
    }
});

// Tạo model từ schema và xuất nó
const Invoice = mongoose.model('Invoice', InvoiceSchema,"invoices");

module.exports = Invoice;