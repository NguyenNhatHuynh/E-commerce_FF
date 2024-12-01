const product = require("../../models/products");
const category = require("../../models/category");
const account = require("../../models/account");

module.exports.index = async (req, res) => {
  const products = await product
    .find({
      featured: "1",
      status: "active",
      deleted: false,
    })
    .sort({ SEO: -1 });
  for (const item of products) {
    const accounts = await account.findOne({
      token: item.shopid,
    });
    item.account = accounts;
  }
  let productsFeatured = [];
  for (let item of products) {
    if (productsFeatured.length >= 4) {
      break; // Đảm bảo chỉ lấy tối đa 4 sản phẩm
    }
    if (item.account.duration >= 5 && productsFeatured.length <= 4) {
      productsFeatured.push(item);
    }
  }
  for (const item of productsFeatured) {
    item.priceNew = (
      (item.price / 100) *
      (100 - item.discountPercentage)
    ).toFixed(0);
    item.priceNew =
      item.priceNew.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  }

  const producthotsale = await product
    .find({
      status: "active",
      deleted: false,
    })
    .sort({ discountPercentage: -1 });
  for (const item of producthotsale) {
    const accounts = await account.findOne({
     });
    if(accounts){
      item.account = accounts;
    }
  }
  let productshotsale = [];
  for (let item of producthotsale) {
    if (productshotsale.length >= 4) {
      break; // Đảm bảo chỉ lấy tối đa 4 sản phẩm
    }
    if (item.account.duration >= 3 && productshotsale.length <= 4) {
      productshotsale.push(item);
    }
  }
  for (const item of producthotsale) {
    item.priceNew = (
      (item.price / 100) *
      (100 - item.discountPercentage)
    ).toFixed(0);
    item.priceNew =
      item.priceNew.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  }


  const randomProducts = await product.aggregate([
    { $match: { status: "active", deleted: false } },
    { $sample: { size: 8 } }
]);
for (const item of randomProducts) {
  item.priceNew = (
    (item.price / 100) *
    (100 - item.discountPercentage)
  ).toFixed(0);
  item.priceNew =
    item.priceNew.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
}

  const data = await category.find({
    parent_id: "",
  });
  console.log(productshotsale);
  res.render("client/page/home/index", {
    pageTitle: "Trang chủ",
    data: productsFeatured,
    productshotsale: productshotsale,
    category: data,
    randomProducts: randomProducts
  });
};
