const product = require("../../models/products")
module.exports.index = async(req,res) => {
    console.log(res.locals.role.permissions)
    const products = await product.countDocuments({
      
    })
    res.render("admin/page/dashboardmin/index",{
       products : products,
       pageTitle : "Trang tổng quang"
    })
   }