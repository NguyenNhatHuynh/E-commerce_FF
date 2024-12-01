const mongoose = require("mongoose");

const account = new mongoose.Schema(
    {
        fullName : String,
        email : String,
        password : String,
        token : String,
        phone : String,
        avatar : {
            type : String,
            default : "https://res.cloudinary.com/dkbvldq5r/image/upload/v1713428203/jdnjrj5mermoqpnvt1ax.jpg"
        },
        dateregister : {
            type : String,
        },
        role_id : String,
        status : String,
        duration : {
            type : String,
            default : 0
        },
        cccd : String,
        birthday : String,
        age : Number,
        category_id : String,
        nameshop : String,
        address: {
            name: { type: String}, // Sử dụng default null
            latitude: { type: Number }, // Sử dụng default null
            longitude: { type: Number}, // Sử dụng default nul
        },
        deleted : {
            type : Boolean,
            default : true,
        },
        Licensing : {
            type : Boolean,
            default : false,
        },
        codeactive : String,
        deletedAt : Date,
        money : {
            type : Number,
            default : 0
        },
        follow : {
            type : Number,
            default : 0
        },
        SEO : {
            type : Number,
            default : 0
        },
        descriptionseo : {
            type : String,
            default : ""
          }

    },{
        timestamps : true
    }
)

const Account = mongoose.model("Account",account,"account")

module.exports = Account