const mongoose = require("mongoose");

const review = new mongoose.Schema({
  content : String,
  images : {
    type : Array,
    default : []
  },
  rating : 
    Number  ,
  user_id : String,
  product_id : String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

const reviews = mongoose.model("review", review, "review");

module.exports = reviews;