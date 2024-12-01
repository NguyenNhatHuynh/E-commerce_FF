const account = require("../../models/account")
const category = require("../../models/category")
const md5 = require("md5")
const system = require("../../setting/system")
const forgotpassword = require("../../models/forgot")

sendMail = (email, subject, content) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "nhutphi0122386@gmail.com",
        pass: "ekkyiudjsnlxjrrf"
      }
    });
  
    const mailOptions = {
      from: "nhutphi0122386@gmail.com",
      to: email,
      subject: subject,
      html: content
    };
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
     console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        // do something useful
      }
    });
  };
  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    let result = "";
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return result;
  };
  const generateRandomNumber = (length) => {
    const characters = "0123456789";
  
    let result = "";
  
    while (result.length < length) {
      console.log(characters.charAt(Math.floor(Math.random() * characters.length)))
      result += characters.charAt(Math.floor(Math.random() * characters.length)); 
    }
  
    return result
  }
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
module.exports.index = (req,res) => {
    res.render("auth/page/login/index.pug")
}

module.exports.indexpost = async (req,res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await account.findOne({
        email : email,
    })
    if(!user){
        req.flash("error","Email không tồn tại")
        res.redirect("back")
        return
    }
    if(md5(password) != user.password){
        req.flash("error","Mật Khẩu Không đúng")
        res.redirect("back")
        return
    }
    if(user.deleted == true){
        req.flash("error","Tài Khoản Của Bạn Chưa Được Xác Nhận")
        res.redirect("back")
        return
    }
    if(user.Licensing == false){
      req.flash("error","Tài Khoản Của Bạn Chưa Được Kích Hoạt")
      res.redirect("back")
      return
    }
    if(user.status != "active"){
        req.flash("error","Tài Khoản của bạn đang bị khóa")
        res.redirect("back")
        return
    }
    req.flash("nice","Đăng Nhập Thành Công")
    res.cookie("token",user.token);
    res.redirect(`/${system.prefixAdmin}/dashboard`)
}

module.exports.confim = async (req,res) => {
  res.render("auth/page/login/confim.pug")
}
module.exports.confimpost = async (req,res) => {
  const {email,codeactive} = req.body
  const dataaccount = await account.findOne({
    email : email,
    Licensing : false
  })
  if(dataaccount && dataaccount.codeactive == codeactive){
     await account.updateOne({
       email : email,
       Licensing : false
     },{ $set : {Licensing : true}})
     req.flash("nice","Kích Hoạt Thành Công")
     res.redirect("/auth/loginadmin")
     return
  }
  req.flash("error","Kích Hoạt Thất Bại vui lòng kiểm tra lại tài khoản và mã kích hoạt")
  res.redirect("/auth/loginadmin")
}

module.exports.forgotpassword = async (req,res) => {
  res.render("auth/page/login/forgotpassword.pug")
}

module.exports.forgotpasswordpost = async (req,res) => {
  const {email} = req.body
  const dataemail = await account.findOne({
    email : email
  })
  if(!dataemail){
    req.flash("error","Email Không Tồn Tại")
    res.redirect("back")
    return
  }
  const objectforgot = {
    email : email,
    otp : generateRandomNumber(4)
  }
  const newdata = new forgotpassword(objectforgot)
  newdata.save();
  const content = `Mã OTP từ sàn FFN , vui lòng không cung cấp cho một ai ${objectforgot.otp}`
  sendMail(email,"Bạn Có Một Thông Báo Từ Sàn FFN",content)
  res.redirect(`/auth/loginadmin/forgotpasswordotp/${objectforgot.email}`)
}

module.exports.forgotpasswordotp = async (req,res) => {
  res.render("auth/page/login/otp.pug",{
    email : req.params.email
  })
}

module.exports.forgotpasswordotppost = async (req,res) => {
  const {email,otp} = req.body

  const exitsotp = await forgotpassword.findOne({
      email : email,
      otp : otp.join("")
  })

  if(!exitsotp){
    req.flash("error","Mã Xác Thực Không Đúng")
    res.redirect("back")
    return
  }
  console.log(exitsotp.email)
  const dataaccount = await account.findOne({
    email : exitsotp.email
  })
  console.log(dataaccount.token)
  res.cookie("token",dataaccount.token)
  res.redirect("/auth/loginadmin/forgotpasswordreset")
}
 


module.exports.forgotpasswordreset = async (req,res) => {
  res.render("auth/page/login/resetpw.pug")
}


module.exports.forgotpasswordresetpost = async (req,res) => {
  const {password,confimpassword} = req.body
  console.log(password,confimpassword)
  if(password != confimpassword){
    req.flash("error","Mật Khẩu Xác Nhận Không Đúng")
    res.redirect("back")
    return
  }
  const token = req.cookies.token
  console.log(token)
  await account.updateOne({
     token : token
  },{$set : {password : md5(password)}})
  req.flash("nice","Cập Nhật Mật Khẩu Thành Công")
  res.redirect("/auth/loginadmin")
}


module.exports.register = async (req,res) => {
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
   const datacategory = await category.find({
    parent_id : ""
   })
    res.render("auth/page/login/register.pug",{
        datacategory : datacategory,
        place : vietnamProvinces
    })
}

module.exports.registerpost = async (req,res) => {
  const checkemail = await account.findOne({
    email : req.body.email,
  })
   if(checkemail){
    req.flash("error","Email đã tồn tại")
    res.redirect("back");
    return;
  }
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
    console.log(req.body)
    const dataaddress = vietnamProvinces.find(item => item.id == req.body.address)
    const editdataaddress = {
        name : dataaddress.name,
        latitude : dataaddress.coordinates.latitude,
        longitude : dataaddress.coordinates.longitude
    }
    const datetime = getCurrentDateVietnam().split(" ")
    const data = {
        email : req.body.email,
        password : md5(req.body.password),
        duration : 0,
        phone : req.body.phone,
        cccd : req.body.cccd,
        birthday : req.body.birthday,
        fullName : req.body.fullName,
        age : req.body.age,
        category_id : req.body.category_id,
        nameshop : req.body.nameshop,
        address : editdataaddress,
        role_id : "65e6dd655cd0fe637c2d3afd",
        status : "active",
        token : generateRandomString(30),    
        dateregister : datetime[0]    
    }
    console.log(data)
    const newdata = new account(data)
    newdata.save()
    res.redirect("/auth/loginadmin")
}
module.exports.logout = async (req,res) => {
  res.clearCookie("token")
  res.redirect(`/auth/loginadmin`)
}

