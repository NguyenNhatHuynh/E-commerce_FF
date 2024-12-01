const Category = require("../../models/category")
const system = require("../../setting/system")
module.exports.index = async (req,res) => {
   const category = await Category.find({
     deleted : false
   })
   res.render("admin/page/category/index",{
    pagetitle : "Trang Danh Mục",
    data : category
  })
}

module.exports.create = async (req,res) => {
    const category = await Category.find({
        deleted : false
    })
    console.log(category)

    const createTree = (arr, parentId = "") => {
        const tree = [];
        arr.forEach((item) => {
          if (item.parent_id === parentId) {
            const newItem = item;
            const children = createTree(arr, item.id);
            if (children.length > 0) {
              newItem.children = children;
            }
            tree.push(newItem);
          }
        });
        return tree;
      };
    const newdata = createTree(category)
    console.log(newdata)
    res.render("admin/page/category/create",{
        pagetitle : "Trang Danh Mục",
        data : newdata 
      })
 }

module.exports.createpost = async (req,res) => {
   try {
    if(req.body.position == ""){
        const count = await Category.countDocuments();
        req.body.position = count + 1
       }else{
        req.body.position = parseInt(req.body,position)
       }
       console.log(req.body)
       const record = new Category(req.body) 
       await record.save()
       req.flash("nice", "Thêm Mới Sản Phẩm Thành Công")
       res.redirect(`/${system.prefixAdmin}/category`)
    
   } catch (error) {
    console.log(req.body)
    req.flash("erro", "Thêm Mới Sản Phẩm Thất Bại")
    res.redirect(`/${system.prefixAdmin}/category`)
   }
 }

module.exports.edit = async (req,res) => {
    try {
      const id = req.params.id
      const data = await Category.findOne({
          _id : id,
          deleted : false
      })
      const category = await Category.find({
          deleted : false
      })
      const createTree = (arr, parentId = "") => {
        const tree = [];
        arr.forEach((item) => {
          if (item.parent_id === parentId) {
            const newItem = item;
            const children = createTree(arr, item.id);
            if (children.length > 0) {
              newItem.children = children;
            }
            tree.push(newItem);
          }
        });
        return tree;
      };
      const newcategory = createTree(category)
      res.render(`${system.prefixAdmin}/page/category/edit`,{
          data : data,
          category : newcategory
      })
    } catch (error) {
      res.redirect("back")
    }
}

module.exports.editpost = async (req,res) => {
   try {
    const body = req.body
    await Category.updateOne({
      _id : req.params.id
    },body)
    req.flash("nice","Cập Nhật Thành Công")
    res.redirect(`/${system.prefixAdmin}/category`)
   } catch (error) {
    req.flash("faild","Cập Nhật Không Thành Công")
    res.redirect(`/${system.prefixAdmin}/category`)
   }
}