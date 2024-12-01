const bill = require("../../models/bill")
const detail = require("../../models/detailbill")
const products = require("../../models/products")
module.exports.index = async (req,res) => {
 console.log(res.locals.role.permissions)
 const datadoanhthu = await bill.find({
    idshop : res.locals.user.token,
    status : 1
 })
 let datadoanhthugroupby = []
 for(let i = 0 ; i < 12 ; i++){
    datadoanhthugroupby.push({
        month : i + 1,
        total : 0,
        donhang : 0
    })
 }
 const datatop5sanpham = []
for(let i = 0 ; i < 5 ; i++){
    
    datatop5sanpham.push({
    idsanpham : 0,
    count : 0
})
}
 for(const item of datadoanhthu){
     let handlestring = item.Timecomplete.split(" ")
     let date = handlestring[0].split("-")
     const check = datadoanhthugroupby.findIndex((item) => item.month == date[1])
     datadoanhthugroupby[check].total += item.revenue
    
     const datadetail = await detail.find({
        idhoadon : item.id
     })
     datadoanhthugroupby[check].donhang += datadetail.length
     for(const itemdetail of datadetail){
        const check = datatop5sanpham.findIndex(item => item.idsanpham == itemdetail.idsanpham)
        if(check == -1){
            datatop5sanpham.push({
                idsanpham : itemdetail.idsanpham,
                count : itemdetail.quality
            })
            continue
        }
        datatop5sanpham[check].count += itemdetail.quality
     }
 }
 const mamau = ['#1DE9B6', '#0EACF5', '#9C92D5', '#F4C22B',"#7E8083"]
 const newdatatop5sanpham = datatop5sanpham.sort((a,b) => b.count - a.count).slice(0,5)
 const formatdatatop5sanpham = await Promise.all(newdatatop5sanpham.map(async (item,index) => {
     if(item.idsanpham == 0)
        {
            return (
                {
                idsanpham : "null",
                count : 0,
                title : "null",
                mamau : mamau[index],
                total : 0
               }
            )
        }
        else{
            const data = await products.findOne({
                   _id : item.idsanpham
            })
            return (
                {
                    count : item.count,
                    title : data.title,
                    products : data,
                    mamau : mamau[index],
                    total : parseInt((item.count) * ((data.price / 100) * (100 - data.discountPercentage))).toFixed(0)
                }
            )
        }
    
 }))
 
 console.log(formatdatatop5sanpham)
 res.render("admin/page/chart/index.pug",{
    datadoanhthugroupby : datadoanhthugroupby,
    newdatatop5sanpham : formatdatatop5sanpham
 })
}