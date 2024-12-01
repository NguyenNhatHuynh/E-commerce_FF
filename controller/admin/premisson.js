const prefixAdmin = require("../../setting/system")
const role = require("../../models/roles")
module.exports.index = async(req,res) => {
    if(res.locals.role.permissions.findIndex(permission => permission === "roles_permissions") !== -1){
        const record = await role.find({
            deleted : false
        })
        // console.log(record)
        res.render(`admin/page/premisson/index`,{
            records : record
        })  
    }
    else{
        res.redirect(`back`)
    }
}

module.exports.handlepremisson = async (req,res) => {
    if(res.locals.role.permissions.findIndex(permission => permission === "roles_permissions") !== -1){
        const data = JSON.parse(req.body.role)
        console.log(data)
       try {
            for(const item of data) {
                console.log(item)
                console.log(item.premisson)
                await role.updateOne({
                _id : item.id
                },{
                permissions : item.premisson
                })
            };
            req.flash("nice","Phần Quyền Thành Công")
       } catch (error) {
            req.flash("error","Phần Quyền Không Thành Công")
       }
        res.redirect("back")
    }
    else{
        res.redirect("back")
    }
   
}