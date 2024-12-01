const account = require("../../models/accountuser")
const roles = require("../../models/roles")
const system = require("../../setting/system")
module.exports = async (req,res,next) => {
    const token = req.cookies.token
    if(!token){
        req.flash("error","Vui Lòng Đăng Nhập")
        res.redirect(`/auth/login`)
        return
    }
    try {
        const data = await account.findOne({
            token : token,
            deleted : false
        }).select("-password");
        if(!data){
            req.flash("error","Mày Xài Token fake hả mày là hacker đúng không")
            res.redirect(`/auth/login`)
            return
        }
        const role = await roles.findOne({
            _id : data.role_id,
            deleted : false
        })
        res.locals.user = data
        res.locals.role = role
        next()
        
    } catch (error) {
        console.log(error)
        req.flash("error","đây là token ảo")
        res.redirect(`/auth/login`)
        return
    }
}