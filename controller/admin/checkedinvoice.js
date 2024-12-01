const invoice = require("../../models/bill")
const account = require("../../models/account")
const accountuser = require("../../models/accountuser")
const detailbill = require("../../models/detailbill")
const statisticsSchema = require("../../models/staticsenma")
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
    const datainvoice = await invoice.find({
        orderStatus : "complete",
        checked : "false"
    })
    console.log(datainvoice)
    for(const item of datainvoice){
        const datashop = await account.findOne({
            token : item.idshop
        })
        const datauser = await accountuser.findOne({
            tokenuser : item.iduser
        })
        item.datashop = datashop
        item.datauser = datauser
        if(parseInt(datashop.duration) < 3){
            item.thue = 4
        }
        else if(parseInt(datashop.duration) < 5){
            item.thue = 3
        }
        else{
            item.thue = 2
        }
        // let thoigian = (getCurrentDateVietnam().getTime() - item.Time.getTime()) / (1000 * 3600 * 24);
        let date1 = getCurrentDateVietnam().toString();
        let date2 = item.Timecomplete.toString();
        const parts = date1.split(" ");
        const dateParts = parts[0].split("-");
        const timeParts = parts[1].split(":");
        const newDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${timeParts.join(":")}`;



        const parts2 = date2.split(" ");
        const dateParts2 = parts2[0].split("-");
        const timeParts2 = parts2[1].split(":");
        const newDateString2 = `${dateParts2[2]}-${dateParts2[1]}-${dateParts2[0]} ${timeParts2.join(":")}`;
        
        const dateformat1 = new Date(newDateString)
        const dateformat2 = new Date(newDateString2)
        const timeend = dateformat1 - dateformat2
        
        const daterequest = timeend / (1000 * 60 * 60 * 24);
        item.request = false
        if(daterequest > 1){
            item.request = true
        } 
    }
    res.render("admin/page/checkinvoice/index.pug",{
        datainvoice : datainvoice
    })
}

module.exports.indexpost = async (req,res) => {
    const {id} = req.params
    await invoice.updateOne({
        _id : id
    }, {$set : {checked : true}})
    const datainvoice = await invoice.findOne({
        _id : id
    })
    const datashop = await account.findOne({
        token : datainvoice.idshop
    })
    const datadetail = await detailbill.countDocuments({
        idhoadon : datainvoice.id
    })
    const date = getCurrentDateVietnam().split(" ")
    const check = await statisticsSchema.findOne({
        date : date[0]
    })
    if(parseInt(datashop.duration) < 3){
        datashop.thue = 4
    }
    else if(parseInt(datashop.duration) < 5){
        datashop.thue = 3
    }
    else{
        datashop.thue = 2
    }
    if(!check){
        const newdate = {
            date : date[0],
            totaltransaction : datainvoice.total,
            revenue : datainvoice.total / 100 * parseInt(datashop.thue),
            dailyOrders : datadetail,
            codetransaction : [id]
        }
        const newstaticsenma = new statisticsSchema(newdate)
        await newstaticsenma.save()
        await invoice.updateOne({
            _id : id
        }, {$set : {revenue : newdate.totaltransaction - newdate.revenue}})
    }
    else
    {
        const newdate = {
            date : date[0],
            totaltransaction : datainvoice.total,
            revenue : datainvoice.total / 100 * parseInt(datashop.thue),
            dailyOrders : datadetail,
            codetransaction : id
        }
        await statisticsSchema.updateOne(
            { date: date[0] }, 
            { $inc: { totaltransaction: newdate.totaltransaction,revenue : newdate.revenue,dailyOrders : newdate.dailyOrders } ,
            $push: {codetransaction : newdate.codetransaction}}
        );
        await invoice.updateOne({
            _id : id
        }, {$set : {revenue : newdate.totaltransaction - newdate.revenue}})
    }
    res.redirect("back")
}