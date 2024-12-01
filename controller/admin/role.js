const role = require("../../models/roles")
const system = require("../../setting/system")
module.exports.index = async (req,res) => {
    const getrole = await role.find({

    })
    res.render("admin/page/role/index",{
       pageTitle : "Trang tổng quang",
       data : getrole
    })
}

module.exports.create = async(req,res) => {
    res.render("admin/page/role/create")
}

module.exports.createpost = async(req,res)=> {
    const record = new role(req.body);
    await record.save();
    res.redirect(`/${system.prefixAdmin}/role`)
}

module.exports.edit = async(req,res)=> {
   try {
     const record = await role.findOne({
         _id: req.params.id,
         deleted: false
       });
     
       res.render("admin/page/role/edit", {
         pageTitle: "Chỉnh sửa Nhóm quyền",
         record: record
       });
   } catch (error) {
    res.redirect("back")
   }
}

module.exports.editpost = async(req,res)=> {
    await role.updateOne({
        _id: req.params.id,
        deleted: false
      }, req.body);
    res.redirect(`/${system.prefixAdmin}/role`)
}