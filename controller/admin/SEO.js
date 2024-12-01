const products = require("../../models/products")
const category = require("../../models/category")
const account = require("../../models/account")
module.exports.index = async (req,res) => {
    const dataproducts = await products.find({
        shopid : res.locals.user.token,
        Licensing : true
    })
    const datacount =  await account.findOne({
        token : res.locals.user.token
    })
   console.log(datacount)
    res.render("admin/page/SEO/index.pug",{
        dataproducts : dataproducts,
        account : datacount
    }
)
}

module.exports.view = async (req,res) => {
    const dataproducts = await products.findOne({
        _id : req.params.id,
    })
    const datacategory = await category.findOne({
        _id : dataproducts.categoryid,
        deleted : false
      })
      dataproducts.category = datacategory
      console.log(dataproducts)
    res.render("admin/page/SEO/view.pug",{
        data : dataproducts
    })
}


module.exports.descriptionshop = async(req,res) => {
     console.log(req.body)
        await account.updateOne({
            token : res.locals.user.token
         },{$set : { descriptionseo : req.body.descriptionseo}})
     res.redirect("back")
}

module.exports.keyword = async(req,res) => {
    console.log(req.params)
    await products.updateOne({
        _id : req.params.id
    }, {$set : { descriptionseo : req.params.word}})
    res.redirect("back")
}