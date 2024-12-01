module.exports.index = (req,res) => {
 console.log(res.locals.role.permissions)
 res.render("admin/page/dashborad/index",{
    pageTitle : "Trang tổng quang"
 })
}