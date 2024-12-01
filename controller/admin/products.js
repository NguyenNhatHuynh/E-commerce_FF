const products = require("../../models/products")
const Category = require("../../models/category")
const system = require("../../setting/system")

module.exports.index = async (req, res) => {
  console.log(res.locals.user)
  const fillterState = [
    {
      name: "Tất cả",
      status: "",
      class: " "
    },
    {
      name: "Hoạt động",
      status: "active",
      class: ""
    },
    {
      name: "Dừng Hoạt Động",
      status: "inactive",
      class: " "
    }
  ]
  const paginet = {
    start: 0,
    limit: 4
  }
  
  const find = {
    deleted: false,
    shopid : res.locals.user.token
  }
 
  const sort = {}
  if(req.query.sortkey)
  {
   sort[req.query.sortkey] = req.query.sortvalue
  }
  else{
    sort["position"] = "desc"
  }

  let uppdatestart = req.query.page

  if (req.query.status) {
    const index = fillterState.findIndex((item) => {
      return (
        item.status == req.query.status
      )
    })
    fillterState[index].class = "active"
  }
  else {
    fillterState[0].class = "active"
  }



  if (req.query.status) {
    find.status = req.query.status
  }

  if (req.query.key) {
    const regex = new RegExp(req.query.key, "i")
    find.title = regex
  }

  const countproduct = await products.countDocuments(find);
  paginet.totalpage = Math.ceil(countproduct / paginet.limit)


  if (req.query.page && parseInt(uppdatestart) > 0 && parseInt(uppdatestart) <= paginet.totalpage) {
    paginet.start = parseInt(uppdatestart)
    paginet.skip = (paginet.start - 1) * paginet.limit
  } else {
    paginet.start = 1
    paginet.skip = (paginet.start - 1) * paginet.limit
  }
  console.log(countproduct)
  console.log(paginet)
  const product = await products.find(find)
    .sort(sort)
    .limit(paginet.limit)
    .skip(paginet.skip)
  res.render("admin/page/products/index", {
    products: product,
    fillterStates: fillterState,
    key: req.query.key,
    paginet: paginet
  })
}

module.exports.change = async (req, res) => {
  console.log(req)
  const id = req.params.id
  const action = req.params.action
  await products.updateOne({
    _id: id
  }, {
    status: action
  })
  req.flash('nice', 'Cập Nhật Trạng Thái Thành Công !')
  res.redirect("back")
}

module.exports.changeall = async (req, res) => {
  // console.log(req)
  // console.log(req.body)
  let ids = req.body.ids.split(',')
  let type = req.body.type
  console.log(ids)
  console.log(type)
  switch (type) {
    case "active":
    case "inactive":
      await products.updateMany({
        _id: { $in: ids }
      },
        {
          status: type
        })
      req.flash('nice', 'Cập Nhật Trạng Thái Thành Công !')
      break
    case "deleteall":
      await products.updateMany({
        _id: { $in: ids }
      }, {
        deleted: true,
        deletedAt: new Date()
      })
      break
    default:
      break
  }
  res.redirect("back")
}

module.exports.delete = async (req, res) => {
  const id = req.params.id
  try {
    await products.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date()
    })
  } catch (error) {
    res.redirect("back")
  }
  res.redirect("back")
}

module.exports.create = async (req, res) => {
  const category = await Category.find({
    deleted : false,
    parent_id : res.locals.user.category_id
  })
  // const createTree = (arr, parentId = "") => {
  //   const tree = [];
  //   arr.forEach((item) => {
  //     if (item.parent_id === parentId) {
  //       const newItem = item;
  //       const children = createTree(arr, item.id);
  //       if (children.length > 0) {
  //         newItem.children = children;
  //       }
  //       tree.push(newItem);
  //     }
  //   });
  //   return tree;
  // };
  // const newcategory = createTree(category)
  console.log(category)
  res.render("admin/page/products/create",{
    data : category
  })
}

module.exports.createpost = async (req, res) => {
  req.body.shopid = req.cookies.token
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position == "") {
    const countProducts = await products.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  // if(req.file && req.file.filename){
  //   req.body.thumbnail = `/upload/${req.file.filename}`
  // }
  console.log(req.body)
  console.log(req.file)
  const product = new products(req.body)
  await product.save();
  req.flash('nice', 'Cập Nhật Trạng Thái Thành Công !')
  res.redirect(`/${system.prefixAdmin}/products`)
}

module.exports.edit = async (req, res) => {
 try {
  const id = req.params.id
  const data = await products.findOne({
    _id: id,
    deleted: false
  })
  const category = await Category.find({
    deleted : false,
    parent_id : res.locals.user.category_id
  })
  // const createTree = (arr, parentId = "") => {
  //   const tree = [];
  //   arr.forEach((item) => {
  //     if (item.parent_id === parentId) {
  //       const newItem = item;
  //       const children = createTree(arr, item.id);
  //       if (children.length > 0) {
  //         newItem.children = children;
  //       }
  //       tree.push(newItem);
  //     }
  //   });
  //   return tree;
  // };
  // const newcategory = createTree(category)
  
  res.render("admin/page/products/edit", {
    data: data,
    category : category
  })
 } catch (error) {
  res.redirect("back")
 }
}

module.exports.editpost = async (req, res) => {
  console.log(req.body)
  const id = req.body.id
  req.body.Licensing = false
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  const data = await products.findOne({
    _id : id
  })
  console.log(data)
  await products.updateOne({
    _id: id,
    deleted: false
  }, req.body)
  req.flash('nice', 'Cập Nhật Trạng Thái Thành Công !')
  res.redirect("/admin/products")
}