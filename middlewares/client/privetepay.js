const accountuser = require("../../models/accountuser")
const Cart = require("../../models/cart")
const roles = require("../../models/roles")
const system = require("../../setting/system")
module.exports = async (req,res,next) => {
    const token = req.cookies.tokenuser
    if(!token){
        req.flash("error","Vui Lòng Đăng Nhập")
        res.redirect(`/auth/loginuser`)
        return
    }
  
    const data = await accountuser.findOne({
        tokenuser : token,
        deleted : false
    }).select("-password");
    if(!data){
        req.flash("error","Mày Xài Token fake hả mày là hacker đúng không")
        res.redirect(`/auth/loginuser`)
        return
    }
    if(data.address.name == null){
        req.flash("error","Vui Lòng Câp Nhật Địa Chỉ")
        res.redirect(`/profile`)
        return
    }
    
    const checkcart = await Cart.find({
        userid: req.cookies.tokenuser
    })

    if(checkcart.length < 1){
        req.flash("error","Bạn chưa có sản phẩm nào")
        res.redirect(`/`)
        return
    }
        console.log(data.address)
        res.locals.userclient = data
        next()
 
   
}