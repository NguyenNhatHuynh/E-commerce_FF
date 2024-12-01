const accountuser = require("../../models/accountuser")
const forgot = require("../../models/forgot")
const md5 = require("md5")
const system = require("../../setting/system")
const nodemailer = require('nodemailer');

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
module.exports.login = async (req,res) => {
    res.render(`auth/page/loginuser/index.pug`)
  }
  
module.exports.loginpost = async (req,res) => {
  const email = req.body.email
  const password = req.body.password
  const user = await accountuser.findOne({
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
  if(user.status != "active"){
      req.flash("error","Tài Khoản của bạn đang bị khóa")
      res.redirect("back")
      return
  }
  if(user.deleted == true){
    req.flash("error","Tài Khoản của bạn chưa được kích hoạt")
    res.redirect("back")
    return
  }
  req.flash("nice","Đăng Nhập Thành Công")
  res.cookie("tokenuser",user.tokenuser);
  res.redirect(`/`)
  }
 
module.exports.register = async (req,res) => {

    res.render(`auth/page/loginuser/register.pug`)
  }

module.exports.registerconfim = async (req,res) => { 
    res.render(`auth/page/loginuser/confim.pug`)
}

module.exports.registerconfimpost = async (req,res) => {
  
  const otp = req.body.otp.join('')
  const token = req.cookies.tokenuser
  const data = await accountuser.findOne({
    tokenuser : token
  })
  const macode = await forgot.findOne({
    email : data.email,
    action : "register"
  })
  console.log(macode.otp,parseInt(otp))
  if(macode.otp == parseInt(otp)){
    
    await accountuser.updateOne({
      tokenuser : token
    },
    { $set: { deleted: false } })

    await forgot.deleteOne({
      email: data.email,
      action: "register"
    });
    req.flash("nice","Xác Nhận thành công")
    res.redirect("/auth/loginuser")
    return
  }
  else{
    req.flash("error","Mã xác Thực Không đúng")
    res.redirect("back")
    return
  }
  
}

module.exports.registerpost = async (req,res) => {
    const {fname,sdt,email,password} = req.body
    const check = await accountuser.findOne({
      email : email,
      deleted : false
    })
    console.log(check)
    if(check){
      req.flash("error","Email đã tồn tại")
      res.redirect("back");
      return;
    }
    const infouser = {
      fullName : fname,
      email : email,
      phone : sdt,
      password : md5(password),
      tokenuser : generateRandomString(30),
      deleted : true
    }
    console.log(infouser)
    const user = new accountuser(infouser)
    await user.save()
    const otp = {
      otp : generateRandomNumber(4),
      email : user.email,
      action : "register",
    }
  
    const newforgot = new forgot(otp)
    await newforgot.save()
    const subject = `Mã OTP Của Đăng Ký của Bạn là`;
    const content = `Mã OTP của bạn là <b>${newforgot.otp}</b>. Vui lòng không chia sẻ với bất cứ ai.`;

    sendMail(user.email, subject, content);
    res.cookie("tokenuser",user.tokenuser)
    // for(let i = 1 ; i <= 20 ; i++){
    //   generateRandomNumber(4)
    //   console.log("đã chạy xong")
    // }
    req.flash("nice","Đăng Ký Thành Công Vui Lòng Xác Thực Tài Khoảng")
    res.redirect(`/auth/loginuser/registerconfim`)
  }
  
module.exports.logout = async (req,res) => {
  res.clearCookie("tokenuser")
  res.redirect("/auth/loginuser")
}