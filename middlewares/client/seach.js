const products = require("../../models/products");
const account = require("../../models/account");
const accountuser = require("../../models/accountuser");
const category = require("../../models/category");
const unidecode = require("unidecode");

const convertToSlug = (text) => {
    // Loại bỏ dấu tiếng Việt và các ký tự đặc biệt
    const unidecodeText = unidecode(text);
  
    const slug = unidecodeText
      .replace(/\s+/g, "-") // Thay thế khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, "-"); // Loại bỏ nhiều dấu gạch ngang liên tiếp
  
    return slug;
  };
module.exports.index = async(req,res,next) => {
  console.log(req.body)
  const regex = new RegExp(req.body.data, "i");
  const regexslug = new RegExp(convertToSlug(req.body.data), "i");
  const product = await products.findOne({
    $or: [
        { title: regex },
        { slug: regexslug },
        { descriptionseo: regex }
    ]
});
  if(product){
    const categorychildren = await category.findOne({
        _id : product.categoryid
     })
     const categoryparent = await category.findOne({
       _id : categorychildren.parent_id
     })
     res.redirect(`/products/index/${categoryparent.slug}`)
     return
  }
   res.redirect("back")
   return
}