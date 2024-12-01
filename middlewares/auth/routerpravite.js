const account = require("../../models/account")
const roles = require("../../models/roles")
const products = require("../../models/products")
const system = require("../../setting/system")
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
module.exports = async (req,res,next) => {
    const token = req.cookies.token
    if(!token){
        req.flash("error","Vui Lòng Đăng Nhập")
        res.redirect(`/auth/loginadmin`)
        return
    }

    try {
        const data = await account.findOne({
            token : token,
            deleted : false
        }).select("-password");
        if(!data){
            req.flash("error","Mày Xài Token fake hả mày là hacker đúng không")
            res.redirect(`/auth/loginadmin`)
            return
        }
        let date1 = getCurrentDateVietnam().toString();
        const parts = date1.split(" ");
        const dateParts = parts[0].split("-");
        const newDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`


        const time = data.dateregister.split("-")
        const timeformat =`${time[2]}-${time[1]}-${time[0]}`
        console.log(newDateString,timeformat)

        const dateformat1 = new Date(newDateString)
        const dateformat2 = new Date(timeformat)
        const timeend = dateformat1 - dateformat2
        
        const daterequest = timeend / (1000 * 60 * 60 * 24 * 365);
        if(daterequest > parseFloat(data.duration) || data.duration == 0){
            req.flash("error","Tài Khoản của bạn đã hết hạn vui lòng gia hạn tài khoản")
            res.redirect("/admin/maintain")
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
        res.redirect(`/auth/loginadmin`)
        return
    }
}