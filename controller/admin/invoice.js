
const bill = require("../../models/bill")
const detail = require("../../models/detailbill")
const products = require("../../models/products")
const shop = require("../../models/account")
const momo = require("../../models/momo")
const moment = require("moment")
function getCurrentDateVietnam() {
    const vietnamTimezoneOffset = 7; // GMT+7 for Vietnam
    let now = new Date(); // Current date and time in user's timezone
    let localTime = now.getTime();
    let localOffset = now.getTimezoneOffset() * 60000; // convert to milliseconds
    let utc = localTime + localOffset;
    let vietnamTime = utc + (3600000 * vietnamTimezoneOffset);
    let vietnamDate = new Date(vietnamTime);

    // Format date as 'dd-mm-yyyy hh:mm:ss'
    let day = vietnamDate.getDate().toString().padStart(2, '0');
    let month = (vietnamDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
    let year = vietnamDate.getFullYear();
    let hours = vietnamDate.getHours().toString().padStart(2, '0');
    let minutes = vietnamDate.getMinutes().toString().padStart(2, '0');
    let seconds = vietnamDate.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
module.exports.index = async (req,res) => {
    const token = res.locals.user.token

    const databill = await bill.find({idshop : token})
    for(const item of databill){
    }
    console.log(databill)
    res.render("admin/page/invoice/index.pug",{
        data : databill
    })
}

module.exports.detail = async (req,res) => {
    const {id} = req.params
    const invoice = await bill.findOne({_id : id})
    const detailinvoice =  await detail.find({idhoadon : id})
    for(const item of detailinvoice){
        const dataproducts = await products.findOne({
            _id : item.idsanpham
            
        })
        console.log(dataproducts)
        item.priceNew = ((dataproducts.price / 100) * (100-dataproducts.discountPercentage)).toFixed(0);
        item.total = item.priceNew * item.quality
        item.priceNew = item.priceNew.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'; 
        item.total = item.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'
        item.products = dataproducts
    }
    res.render("admin/page/invoice/detail.pug",{
        detailinvoice : detailinvoice,
        invoice : invoice
    })
}

module.exports.detailmomo = async (req,res) => {
    const {id} = req.params
    const invoice = await bill.findOne({_id : id})
    const detailinvoice =  await momo.find({idhoadon : id})
    res.render("admin/page/invoice/momodetail.pug",{
        invoice : invoice,
        detailinvoice : detailinvoice
    })
}


module.exports.status = async (req,res) => {
    const token = res.locals.user.token
    const {id} = req.params
    let data = []
    if(id == 0){
         data = await bill.find({
            idshop : token,
            status : 0
        })
    }
    if(id == 1){
        data = await bill.find({
            idshop : token,
            orderStatus : "Waiting for Confirmation",
            status : 0
        })
    }
    if(id == 2){
        data = await bill.find({
            idshop : token,
            orderStatus : "Confirmation",
            status : 0
        })
    }
    if(id == 3){
        data = await bill.find({
            idshop : token,
            orderStatus : "shipping",
            status : 0
        })
    }
    if(id == 4){
        data = await bill.find({
            idshop : token,
            orderStatus : "complete",
            status : 0
        }) 
    }
    if(id == 5){
        data = await bill.find({
            idshop : token,
            orderStatus : "cancel",
            status : 0
        }) 
    }
    if(id == 6){
        data = await bill.find({
            idshop : token,
            orderStatus : "refund",
            status : 0
        }) 
    }
    console.log(data)
    res.render("admin/page/invoice/status.pug",{
        data : data,
        id : id
    })
}


module.exports.statuspost = async (req,res) => {
  console.log(req.params)
  const status = ["Waiting for Confirmation","Confirmation","shipping","complete"]
  const indexnew = status.findIndex((item) => item == req.params.status)
   console.log(status[indexnew + 1])
   if(status[indexnew + 1] == "complete"){
    await bill.updateOne({
        _id : req.params.id
       }, {$set : {Timecomplete : getCurrentDateVietnam()}})
   }
   if(status[indexnew] == status.length - 1)
   {
    res.redirect("back")
    return
   }
   await bill.updateOne({
    _id : req.params.id
   }, {$set : {orderStatus : status[indexnew + 1]}})
  res.redirect("back")
}

module.exports.checkinvoice = async (req,res) => {
    const {id} = req.params
    const invoice = await bill.findOne({
        _id : id
    })
    await bill.updateOne({
        _id : id
    }, {$set : {status : 1}})
    await shop.updateOne({
        token : res.locals.user.token
    } ,{$inc : {money : (invoice.revenue).toFixed(0)}})
     res.redirect("back")
}


module.exports.cancel = async (req,res) => {
    const {id} = req.params
    await bill.updateOne({
        _id : id
    }, {$set : {status : 2}})
    res.redirect("back")
}