const mongoose = require("mongoose");

const voucher = new mongoose.Schema(
    {
        type : String,
        title : String,
        thumbnail : String,
        notecondition : String,
        condition : Number,
        notelimit : {
            type : String,
            default : null
        },
        limit :  {
            type : Number,
            default : 0
        },
        value : String,
        status : String,
        datestart : String,
        dateend : String,
        stock : Number,
        iduser : {
            type : Array,
            default : []
        },
        idshop : {
            type : Array,
            default : []
        },
        products : {
            type : Array,
            default : []
        },
        deletedAt : Date

    },{
        timestamps : true
    }
)

const Voucher = mongoose.model("Voucher",voucher,"voucher")

module.exports = Voucher