const account = require("../../models/account")
const products = require("../../models/products")
module.exports.index = async (req,res) => {
    console.log(req.params)
    const params = req.params.id
    console.log(params)
    const data = await account.findOne({
        _id : params
    })
    console.log(data)
    const dataproducts = await products.find({
        shopid : data.token
    })
    for(const data of dataproducts){
        data.priceNew = ((data.price / 100) * (100-data.discountPercentage)).toFixed(0);
       data.priceNew = data.priceNew.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ';  
    }
    res.render("client/page/shopuser/index",{
        data : data,
        dataproducts : dataproducts
    })
}