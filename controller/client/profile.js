const product = require("../../models/products")
const accountuser = require("../../models/accountuser")
const account = require("../../models/account")
const bill = require("../../models/bill")
const detail = require("../../models/detailbill")
module.exports.index = async(req,res) => {
    let id = 1
    const find = {
        status : 0,
        iduser : req.cookies.tokenuser,
    }
    if(req.query.id){
        id = req.query.id
    }
    const status = ["Waiting for Confirmation","Confirmation","shipping","complete"]
    const vietnamProvinces = [
        { id: 1, name: "Hà Nội", coordinates: { latitude: 21.0285, longitude: 105.8542 } },
        { id: 2, name: "Hồ Chí Minh", coordinates: { latitude: 10.8231, longitude: 106.6297 } },
        { id: 3, name: "Đà Nẵng", coordinates: { latitude: 16.0544, longitude: 108.2022 } },
        { id: 4, name: "Hải Phòng", coordinates: { latitude: 20.8623, longitude: 106.6835 } },
        { id: 5, name: "Cần Thơ", coordinates: { latitude: 10.0458, longitude: 105.7469 } },
        { id: 6, name: "An Giang", coordinates: { latitude: 10.5254, longitude: 105.1968 } },
        { id: 7, name: "Bà Rịa - Vũng Tàu", coordinates: { latitude: 10.4601, longitude: 107.1692 } },
        { id: 8, name: "Bạc Liêu", coordinates: { latitude: 9.2948, longitude: 105.7245 } },
        { id: 9, name: "Bắc Giang", coordinates: { latitude: 21.2769, longitude: 106.1943 } },
        { id: 10, name: "Bắc Kạn", coordinates: { latitude: 22.1470, longitude: 105.8304 } },
        { id: 11, name: "Bắc Ninh", coordinates: { latitude: 21.1860, longitude: 106.0633 } },
        { id: 12, name: "Bến Tre", coordinates: { latitude: 10.2356, longitude: 106.3753 } },
        { id: 13, name: "Bình Định", coordinates: { latitude: 13.9114, longitude: 109.0113 } },
        { id: 14, name: "Bình Dương", coordinates: { latitude: 11.1559, longitude: 106.7055 } },
        { id: 15, name: "Bình Phước", coordinates: { latitude: 11.7516, longitude: 106.6669 } },
        { id: 16, name: "Bình Thuận", coordinates: { latitude: 10.9304, longitude: 108.1004 } },
        { id: 17, name: "Cà Mau", coordinates: { latitude: 9.1769, longitude: 105.1524 } },
        { id: 18, name: "Cao Bằng", coordinates: { latitude: 22.6666, longitude: 106.2544 } },
        { id: 19, name: "Đắk Lắk", coordinates: { latitude: 12.6657, longitude: 108.0362 } },
        { id: 20, name: "Đắk Nông", coordinates: { latitude: 12.0022, longitude: 107.6857 } },
        { id: 21, name: "Điện Biên", coordinates: { latitude: 21.3871, longitude: 103.0163 } },
        { id: 22, name: "Đồng Nai", coordinates: { latitude: 10.9465, longitude: 107.1448 } },
        { id: 23, name: "Đồng Tháp", coordinates: { latitude: 10.4568, longitude: 105.6363 } },
        { id: 24, name: "Gia Lai", coordinates: { latitude: 13.9780, longitude: 108.0043 } },
        { id: 25, name: "Hà Giang", coordinates: { latitude: 22.8324, longitude: 104.9830 } },
        { id: 26, name: "Hà Nam", coordinates: { latitude: 20.5810, longitude: 105.9222 } },
        { id: 27, name: "Hà Tĩnh", coordinates: { latitude: 18.3414, longitude: 105.9010 } },
        { id: 28, name: "Hải Dương", coordinates: { latitude: 20.9404, longitude: 106.3334 } },
        { id: 29, name: "Hậu Giang", coordinates: { latitude: 9.7857, longitude: 105.4667 } },
        { id: 30, name: "Hòa Bình", coordinates: { latitude: 20.7798, longitude: 105.3384 } },
        { id: 31, name: "Hưng Yên", coordinates: { latitude: 20.6474, longitude: 106.0511 } },
        { id: 32, name: "Khánh Hòa", coordinates: { latitude: 12.2388, longitude: 109.1966 } },
        { id: 33, name: "Kiên Giang", coordinates: { latitude: 10.1906, longitude: 105.2564 } },
        { id: 34, name: "Kon Tum", coordinates: { latitude: 14.3548, longitude: 107.9836 } },
        { id: 35, name: "Lai Châu", coordinates: { latitude: 22.3964, longitude: 103.4583 } },
        { id: 36, name: "Lâm Đồng", coordinates: { latitude: 11.5795, longitude: 108.0520 } },
        { id: 37, name: "Lạng Sơn", coordinates: { latitude: 21.8530, longitude: 106.7610 } },
        { id: 38, name: "Lào Cai", coordinates: { latitude: 22.3350, longitude: 103.8479 } },
        { id: 39, name: "Long An", coordinates: { latitude: 10.7366, longitude: 106.4088 } },
        { id: 40, name: "Nam Định", coordinates: { latitude: 20.4344, longitude: 106.1775 } },
        { id: 41, name: "Nghệ An", coordinates: { latitude: 18.7912, longitude: 105.6861 } },
        { id: 42, name: "Ninh Bình", coordinates: { latitude: 20.2524, longitude: 105.9744 } },
        { id: 43, name: "Ninh Thuận", coordinates: { latitude: 11.7969, longitude: 108.7923 } },
        { id: 44, name: "Phú Thọ", coordinates: { latitude: 21.4234, longitude: 105.2078 } },
        { id: 45, name: "Quảng Bình", coordinates: { latitude: 17.5266, longitude: 106.9133 } },
        { id: 46, name: "Quảng Nam", coordinates: { latitude: 15.6360, longitude: 108.0567 } },
        { id: 47, name: "Quảng Ngãi", coordinates: { latitude: 15.1219, longitude: 108.8048 } },
        { id: 48, name: "Quảng Ninh", coordinates: { latitude: 21.0069, longitude: 107.2925 } },
        { id: 49, name: "Quảng Trị", coordinates: { latitude: 16.7420, longitude: 107.1853 } },
        { id: 50, name: "Sóc Trăng", coordinates: { latitude: 9.5995, longitude: 105.9715 } },
        { id: 51, name: "Sơn La", coordinates: { latitude: 21.1778, longitude: 104.0514 } },
        { id: 52, name: "Tây Ninh", coordinates: { latitude: 11.3015, longitude: 106.1006 } },
        { id: 53, name: "Thái Bình", coordinates: { latitude: 20.4535, longitude: 106.3406 } },
        { id: 54, name: "Thái Nguyên", coordinates: { latitude: 21.5942, longitude: 105.8482 } },
        { id: 55, name: "Thanh Hóa", coordinates: { latitude: 19.8076, longitude: 105.7761 } },
        { id: 56, name: "Thừa Thiên Huế", coordinates: { latitude: 16.4679, longitude: 107.5851 } },
        { id: 57, name: "Tiền Giang", coordinates: { latitude: 10.3688, longitude: 106.3387 } },
        { id: 58, name: "Trà Vinh", coordinates: { latitude: 9.9517, longitude: 106.3421 } },
        { id: 59, name: "Tuyên Quang", coordinates: { latitude: 21.8193, longitude: 105.2185 } },
        { id: 60, name: "Vĩnh Long", coordinates: { latitude: 10.2531, longitude: 105.9720 } },
        { id: 61, name: "Vĩnh Phúc", coordinates: { latitude: 21.2923, longitude: 105.5929 } },
        { id: 62, name: "Yên Bái", coordinates: { latitude: 21.7051, longitude: 104.8750 } },
        { id: 63, name: "Phú Yên", coordinates: { latitude: 13.2027, longitude: 109.1217 } }
    ];
    
    if(id && parseInt(id) < 6 && parseInt(id) > 1){    
      find.orderStatus = status[id - 2]    
    }
    else if(parseInt(id) == 1){
        id = 1
    }
    else{
        find.status = { $ne: 0 };
    }
    console.log(find)
    const data = await bill.find(find)
    
   for(const item of data){
      const detailbill = await detail.find({
         idhoadon : item.id
      })
      for(const itemproduct of detailbill){
             const dataproduct = await product.findOne({
                _id : itemproduct.idsanpham
             })
             const shop = await account.findOne({
                token : itemproduct.shopid
             })
             console.log(itemproduct)
            item.nameshop = shop.nameshop
            itemproduct.title = dataproduct.title,
            itemproduct.thumbnail = dataproduct.thumbnail
            itemproduct.pricenew = ((dataproduct.price / 100) * (100-dataproduct.discountPercentage)).toFixed(0)
      }
      item.detail = detailbill
   }
   console.log(data)
   const dataprofile = await accountuser.findOne({
     tokenuser : req.cookies.tokenuser
   })
   res.render("client/page/profile/index",{
    dataprofile : dataprofile,
    diachi : vietnamProvinces,
    data : data,
    id : id
   })
}

module.exports.indexpost = async(req,res) => {
    console.log(req.body)
    const vietnamProvinces = [
        { id: 1, name: "Hà Nội", coordinates: { latitude: 21.0285, longitude: 105.8542 } },
        { id: 2, name: "Hồ Chí Minh", coordinates: { latitude: 10.8231, longitude: 106.6297 } },
        { id: 3, name: "Đà Nẵng", coordinates: { latitude: 16.0544, longitude: 108.2022 } },
        { id: 4, name: "Hải Phòng", coordinates: { latitude: 20.8623, longitude: 106.6835 } },
        { id: 5, name: "Cần Thơ", coordinates: { latitude: 10.0458, longitude: 105.7469 } },
        { id: 6, name: "An Giang", coordinates: { latitude: 10.5254, longitude: 105.1968 } },
        { id: 7, name: "Bà Rịa - Vũng Tàu", coordinates: { latitude: 10.4601, longitude: 107.1692 } },
        { id: 8, name: "Bạc Liêu", coordinates: { latitude: 9.2948, longitude: 105.7245 } },
        { id: 9, name: "Bắc Giang", coordinates: { latitude: 21.2769, longitude: 106.1943 } },
        { id: 10, name: "Bắc Kạn", coordinates: { latitude: 22.1470, longitude: 105.8304 } },
        { id: 11, name: "Bắc Ninh", coordinates: { latitude: 21.1860, longitude: 106.0633 } },
        { id: 12, name: "Bến Tre", coordinates: { latitude: 10.2356, longitude: 106.3753 } },
        { id: 13, name: "Bình Định", coordinates: { latitude: 13.9114, longitude: 109.0113 } },
        { id: 14, name: "Bình Dương", coordinates: { latitude: 11.1559, longitude: 106.7055 } },
        { id: 15, name: "Bình Phước", coordinates: { latitude: 11.7516, longitude: 106.6669 } },
        { id: 16, name: "Bình Thuận", coordinates: { latitude: 10.9304, longitude: 108.1004 } },
        { id: 17, name: "Cà Mau", coordinates: { latitude: 9.1769, longitude: 105.1524 } },
        { id: 18, name: "Cao Bằng", coordinates: { latitude: 22.6666, longitude: 106.2544 } },
        { id: 19, name: "Đắk Lắk", coordinates: { latitude: 12.6657, longitude: 108.0362 } },
        { id: 20, name: "Đắk Nông", coordinates: { latitude: 12.0022, longitude: 107.6857 } },
        { id: 21, name: "Điện Biên", coordinates: { latitude: 21.3871, longitude: 103.0163 } },
        { id: 22, name: "Đồng Nai", coordinates: { latitude: 10.9465, longitude: 107.1448 } },
        { id: 23, name: "Đồng Tháp", coordinates: { latitude: 10.4568, longitude: 105.6363 } },
        { id: 24, name: "Gia Lai", coordinates: { latitude: 13.9780, longitude: 108.0043 } },
        { id: 25, name: "Hà Giang", coordinates: { latitude: 22.8324, longitude: 104.9830 } },
        { id: 26, name: "Hà Nam", coordinates: { latitude: 20.5810, longitude: 105.9222 } },
        { id: 27, name: "Hà Tĩnh", coordinates: { latitude: 18.3414, longitude: 105.9010 } },
        { id: 28, name: "Hải Dương", coordinates: { latitude: 20.9404, longitude: 106.3334 } },
        { id: 29, name: "Hậu Giang", coordinates: { latitude: 9.7857, longitude: 105.4667 } },
        { id: 30, name: "Hòa Bình", coordinates: { latitude: 20.7798, longitude: 105.3384 } },
        { id: 31, name: "Hưng Yên", coordinates: { latitude: 20.6474, longitude: 106.0511 } },
        { id: 32, name: "Khánh Hòa", coordinates: { latitude: 12.2388, longitude: 109.1966 } },
        { id: 33, name: "Kiên Giang", coordinates: { latitude: 10.1906, longitude: 105.2564 } },
        { id: 34, name: "Kon Tum", coordinates: { latitude: 14.3548, longitude: 107.9836 } },
        { id: 35, name: "Lai Châu", coordinates: { latitude: 22.3964, longitude: 103.4583 } },
        { id: 36, name: "Lâm Đồng", coordinates: { latitude: 11.5795, longitude: 108.0520 } },
        { id: 37, name: "Lạng Sơn", coordinates: { latitude: 21.8530, longitude: 106.7610 } },
        { id: 38, name: "Lào Cai", coordinates: { latitude: 22.3350, longitude: 103.8479 } },
        { id: 39, name: "Long An", coordinates: { latitude: 10.7366, longitude: 106.4088 } },
        { id: 40, name: "Nam Định", coordinates: { latitude: 20.4344, longitude: 106.1775 } },
        { id: 41, name: "Nghệ An", coordinates: { latitude: 18.7912, longitude: 105.6861 } },
        { id: 42, name: "Ninh Bình", coordinates: { latitude: 20.2524, longitude: 105.9744 } },
        { id: 43, name: "Ninh Thuận", coordinates: { latitude: 11.7969, longitude: 108.7923 } },
        { id: 44, name: "Phú Thọ", coordinates: { latitude: 21.4234, longitude: 105.2078 } },
        { id: 45, name: "Quảng Bình", coordinates: { latitude: 17.5266, longitude: 106.9133 } },
        { id: 46, name: "Quảng Nam", coordinates: { latitude: 15.6360, longitude: 108.0567 } },
        { id: 47, name: "Quảng Ngãi", coordinates: { latitude: 15.1219, longitude: 108.8048 } },
        { id: 48, name: "Quảng Ninh", coordinates: { latitude: 21.0069, longitude: 107.2925 } },
        { id: 49, name: "Quảng Trị", coordinates: { latitude: 16.7420, longitude: 107.1853 } },
        { id: 50, name: "Sóc Trăng", coordinates: { latitude: 9.5995, longitude: 105.9715 } },
        { id: 51, name: "Sơn La", coordinates: { latitude: 21.1778, longitude: 104.0514 } },
        { id: 52, name: "Tây Ninh", coordinates: { latitude: 11.3015, longitude: 106.1006 } },
        { id: 53, name: "Thái Bình", coordinates: { latitude: 20.4535, longitude: 106.3406 } },
        { id: 54, name: "Thái Nguyên", coordinates: { latitude: 21.5942, longitude: 105.8482 } },
        { id: 55, name: "Thanh Hóa", coordinates: { latitude: 19.8076, longitude: 105.7761 } },
        { id: 56, name: "Thừa Thiên Huế", coordinates: { latitude: 16.4679, longitude: 107.5851 } },
        { id: 57, name: "Tiền Giang", coordinates: { latitude: 10.3688, longitude: 106.3387 } },
        { id: 58, name: "Trà Vinh", coordinates: { latitude: 9.9517, longitude: 106.3421 } },
        { id: 59, name: "Tuyên Quang", coordinates: { latitude: 21.8193, longitude: 105.2185 } },
        { id: 60, name: "Vĩnh Long", coordinates: { latitude: 10.2531, longitude: 105.9720 } },
        { id: 61, name: "Vĩnh Phúc", coordinates: { latitude: 21.2923, longitude: 105.5929 } },
        { id: 62, name: "Yên Bái", coordinates: { latitude: 21.7051, longitude: 104.8750 } },
        { id: 63, name: "Phú Yên", coordinates: { latitude: 13.2027, longitude: 109.1217 } }
    ];
    const dataaddress = vietnamProvinces.find(item => item.id == req.body.address)
    const editdataaddress = {
        name : dataaddress.name,
        latitude : dataaddress.coordinates.latitude,
        longitude : dataaddress.coordinates.longitude
    }
    const update = {
      fullName : req.body.fullName,
      phone : req.body.phone,
      email : req.body.email,
      avatar : req.body.avatar,
      address : editdataaddress,
    }
    console.log(req.body.id)
    try {
        await accountuser.updateOne( {
           _id : req.body.id
        },update)
    } catch (error) {
        res.redirect("back")
    }
    res.redirect("back")
}

module.exports.handelinvoice = async(req,res) => {
    const{id,status} = req.params
    console.log(id,status)
    if(status == "cancel")
    {
        await bill.updateOne({
            _id : id
        },{$set : {orderStatus : "cancel"}})
        res.redirect("back")
        return
    }
    await bill.updateOne({
        _id : id
    },{$set : {orderStatus : "refund"}})
    res.redirect("back")
    return
}

