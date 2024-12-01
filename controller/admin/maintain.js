const { duration } = require("moment")
const account = require("../../models/account")
const statistic = require("../../models/staticsenma")

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
    res.render("admin/page/maintain/index",{
       pageTitle : "Trang tổng quang"
    })
}

module.exports.indexpost = async (req,res) => {
    console.log(req.param)
    const datashop = await account.findOne({
        token : req.cookies.token
    })
    let objectdata ={
        money : 0,
        year : 0,
    };
    switch(req.params.id){
        case "basic" :
            objectdata.money = 4800000; 
            objectdata.year = 1
                break;
        case "intermediate": 
            objectdata.money = 14400000;
            objectdata.year = 3
                break;
        case "premium" : 
            objectdata.money = 24000000;
            objectdata.year = 5
                break;
        default :
          req.flash("error","Đã có lỗi xảy ra")
          res.redirect("back")
          return
    }
    if(datashop.money - objectdata.money < 0){
        req.flash("error","Đã có lỗi xảy ra")
        res.redirect("back")
        return
    }
    const date = getCurrentDateVietnam()
    const dateupdate = date.split(" ")
    await statistic.updateOne({
        date : dateupdate[0]
    }, {$set : { totalregister : objectdata.money}})
    await account.updateOne({
        token : req.cookies.token
    }, {$set : {duration : parseInt(objectdata.year) + parseInt(datashop.duration),money : datashop.money - objectdata.money}})
    req.flash("nice","Chúc mừng bạn đăng ký thành công")
    res.redirect("back")
    return
}