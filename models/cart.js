const mongoose = require("mongoose");

const cart = new mongoose.Schema(
    {
        shopid : String,
        userid : String,
        quality : Number,
        idsanpham : String,
        ship : Number,
        check : {
            type : String,
            default : "1"
        },
        deleted : {
            type : Boolean,
            default : false,
        },
        totalcart : Number,
        deletedAt : Date,

    },{
        timestamps : true
    }
)

const Cart = mongoose.model("Cart",cart,"cart")

module.exports = Cart