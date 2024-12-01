const products = require("../../models/products")
const shop = require("../../models/account")
const category = require("../../models/category")
module.exports.index = async (req,res) => {

    const dataproducts = await products.find({
        Licensing : false
    })
    for(const item of dataproducts){
         const datashop = await shop.findOne({
            token : item.shopid
         })
         const datacategory = await category.findOne({
             _id : datashop.category_id
         })
         item.shop = datashop
         item.Category = datacategory
    }
    console.log(dataproducts)
    res.render("admin/page/checkproducts/index",{
        dataproducts : dataproducts
    })
   }

module.exports.indexpost = async (req,res) => {
    const dataproducts = await products.findOne({
        _id : req.params.id
    })
    const datacategory = await category.findOne({
        _id : dataproducts.categoryid,
        deleted : false
      })
      dataproducts.category = datacategory
    console.log(dataproducts)
    res.render("admin/page/checkproducts/check",{
        data : dataproducts
    })
}


module.exports.check = async (req,res) => {
    const success = []
    for(const item in req.body){
        success.push(item)
    }
    success.shift()
    await products.updateOne({
        _id : req.body.id
    },{$set : {SEO : Object.keys(req.body).length - 1, Licensing : true} , success : success })
    req.flash("nice,Xét Sản Phẩm Thành Công")
    res.redirect("/admin/checkproducts")//"/admin/checkproducts"
}