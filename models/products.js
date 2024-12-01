
const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const productSchema = new mongoose.Schema({
  title: String,
  slug: {
    type : String,
    slug : "title",
    unique : true
  },
  categoryid:{
    type : String,
    default : ""
  },
  shopid : String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,  
  thumbnail: String,
  status: String,
  position: Number,
  deleted: {
    type : Boolean,
    default : false
  },
  deletedAt : Date,
  featured: String,
  Licensing : {
    type : String,
    default : false
  },
  secondaryphoto : {
    type : Array,
    default : []
  },
  SEO : {
    type : Number,
    default : 0
  },
  success : {
    type : Array,
    default : []
  },
  descriptionseo : {
    type : String,
    default : ""
  }
},{
  timestamps : true
});

const Product = mongoose.model("Products", productSchema, "products");

module.exports = Product;