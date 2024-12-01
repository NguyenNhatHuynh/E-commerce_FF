module.exports.createpost = (req,res,next) => {
   // console.log(req.body.title)
   // console.log(req.body.title.length)
   if(req.body.title.length < 5){
   //  console.log("Đã chạy vào đây")
    req.flash("error","tiêu đề không được để trống")
    res.redirect("back");
    return 
   }
   next()
}