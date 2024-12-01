const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho bảng hóa đơn
const detailbill = new Schema({
    idhoadon: { type: String}, // Tham chiếu đến ID của người dùng
    idsanpham: { type: String }, // Tổng tiền hóa đơn
    quality: { type: Number }, // Email của người đặt hàng
    shopid : String,
    ship : Number
   
});

// Tạo model từ schema và xuất nó
const Invoice = mongoose.model('detailbill', detailbill,"detailbills");

module.exports = Invoice;