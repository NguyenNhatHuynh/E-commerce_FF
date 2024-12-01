const products = require("../../models/products");
const account = require("../../models/account");
const accountuser = require("../../models/accountuser");
const category = require("../../models/category");
const review = require("../../models/review");
const unidecode = require("unidecode");
const reviews = require("../../models/review");

const convertToSlug = (text) => {
  // Loại bỏ dấu tiếng Việt và các ký tự đặc biệt
  const unidecodeText = unidecode(text);

  const slug = unidecodeText
    .replace(/\s+/g, "-") // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-"); // Loại bỏ nhiều dấu gạch ngang liên tiếp

  return slug;
};
module.exports.index = async (req, res) => {
  const { key, categorychildren } = req.query;
  const { data } = req.params;
  const categoryparent = await category.findOne({
    slug: data,
  });
  console.log(categoryparent)
  const datacategory = await category.find({
    parent_id: categoryparent.id,
  });
  const newdatacategory = datacategory.map((item) => {
    return item.id;
  });
  const find = {
    categoryid: { $in: newdatacategory },
    status: "active",
    deleted: false,
    Licensing: true,
  };
  if (categorychildren) {
    find.categoryid = categorychildren;
  }
  if (key) {
    const regex = new RegExp(key, "i");
    const regexslug = new RegExp(convertToSlug(key), "i");
    find.$or = [
      { title: regex },
      { slug: regexslug },
      { descriptionseo: regex },
    ];
  }
  const dataproduct = await products.find(find).sort({ SEO: -1 }).limit(20);
  for (const item of dataproduct) {
    item.priceNew = (
      (item.price / 100) *
      (100 - item.discountPercentage)
    ).toFixed(0);
    item.priceNew =
      item.priceNew.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  }
  const dataproductseach = await products
    .find({
      categoryid: { $in: newdatacategory },
      status: "active",
      deleted: false,
    })
    .select("title slug");
  _io.once("connection", async (socket) => {
    socket.on("client_send_keyword_seachindex", (data) => {
      console.log(data.data.length);
      if (data.data.length > 0) {
        console.log(data);
        const relacestring = convertToSlug(data.data);
        const dataafterfilter = dataproductseach.filter((item) => {
          return (
            item.slug.toLowerCase().includes(relacestring.toLowerCase()) ||
            item.title.toLowerCase().includes(data.data.toLowerCase())
          );
        });
        console.log(dataafterfilter);
        const newdata = dataafterfilter.map((item) => {
          return [item.title, item.slug];
        });
        console.log(newdata);
        socket.emit("sever_render_keyword_seachindex", {
          data: newdata,
        });
      }
    });
  });

  res.render("client/page/products/index", {
    products: dataproduct,
    datacategory: datacategory,
  });
};

module.exports.detail = async (req, res) => {
  const { slug } = req.params;
  const data = await products.findOne({
    slug: slug,
  });
  data.priceNew = (
    (data.price / 100) *
    (100 - data.discountPercentage)
  ).toFixed(0);
  data.priceNew =
    data.priceNew.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  const datauser = await account
    .findOne({
      token: data.shopid,
    })
    .select("-password -token");
  const review = await reviews.find({
    product_id: data.id,
  });

  for (const item of review) {
    const user = await accountuser
      .findOne({ tokenuser: item.user_id })
      .select("-password -token");
    item.infor = user;
    const createdAt = new Date(item.createdAt);

    // Chuyển múi giờ sang múi giờ của Việt Nam (GMT+7)
    const vietnamTime = new Date(createdAt.getTime() + 7 * 60 * 60 * 1000);
    item.time = vietnamTime.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      dayFirst: true, // Hiển thị ngày trước giờ
    });
  }

  res.render("client/page/products/detail", {
    data: data,
    datauser: datauser,
    review: review,
  });
};

module.exports.submitcontent = async (req, res) => {
  console.log(req.body);
  const { product_id, images, content, rating } = req.body;
  const tokenuser = req.cookies.tokenuser;
  if (!tokenuser) {
    res.redirect("/auth/loginuser");
    return;
  }
  const infor = {
    user_id: tokenuser,
    product_id: product_id,
    images: images,
    content: content,
    rating: parseInt(rating),
  };
  const data = new review(infor);
  await data.save();
  req.flash("nice", "Đánh Giá Thành Công", "cảm ơn bạn đã góp ý");
  res.redirect("back");
};
