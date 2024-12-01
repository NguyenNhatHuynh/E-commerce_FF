
const voucher = require("../../models/voucher")
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
module.exports.index = async(req,res) => {
    console.log(res.locals.role.permissions)
    const datavoucher = await voucher.find({

    })
    res.render("admin/page/voucher/index",{
       pageTitle : "Voucher",
       voucher : datavoucher
    })
   }
module.exports.create = (req,res) => {
    res.render("admin/page/voucher/create")
}

module.exports.createpost = async(req,res) => {
   console.log(req.body)
   if(req.body.type = "public"){
   const object = {
      type: req.body.type,
      title: req.body.title,
      notecondition: req.body.notecondition,
      condition: req.body.condition,
      notelimit: req.body.notelimit,
      limit: req.body.limit,
      thumbnail: req.body.thumbnail,
      value: req.body.value,
      dateend: req.body.dateend,
      stock: req.body.stock,
      iduser: [],
      idshop: [],
      products: [],
      status: req.body.status,
      datestart : getCurrentDateVietnam()
    };
    const createvoucher = new voucher(object)
    createvoucher.save()
   }
   req.flash("nice","Tạo voucher thành công")
   res.redirect("back")
}

module.exports.deleted = async(req,res) => {
   await voucher.deleteOne({
      _id : req.params.id
   })
   res.redirect("back")
}