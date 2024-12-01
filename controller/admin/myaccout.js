const md5 = require("md5")
const Account = require("../../models/account")
const product = require("../../models/products")
const reviewtable = require("../../models/review")
const Category = require("../../models/category")
module.exports.index = async (req,res) => {
  
  const products = await product.find({
        shopid :  res.locals.user.token
    })
  const account = await Account.findOne({
     token : res.locals.user.token
  })
  const datacategory = await Category.findOne({
    _id : account.category_id
})
account.title = datacategory.title
  let totalrating = 0
  let totalreview = 0
  for(const item of products){
    const datareview = await reviewtable.find({
      product_id : item.id
    })
     for(const itemreview of datareview){
      totalrating += itemreview.rating
      totalreview += 1
     }
  }
  if(totalrating != 0 && totalreview != 0){
    totalrating = ((totalrating) / (totalreview)).toFixed(1)
  }
  console.log(totalrating)
    res.render("admin/page/myaccount/index",{
      product : products.length,
      totalrating : totalrating,
      totalreview : totalreview,
      dataaccount : account
    })
}
module.exports.edit = async (req, res) => {
      const products = await product.find({
        shopid :  res.locals.user.token
    })
    const account = await Account.findOne({
    token : res.locals.user.token
    })
    const datacategory = await Category.findOne({
    _id : account.category_id
    })
    account.title = datacategory.title
    let totalrating = 0
    let totalreview = 0
    for(const item of products){
    const datareview = await reviewtable.find({
      product_id : item.id
    })
    for(const itemreview of datareview){
      totalrating += itemreview.rating
      totalreview += 1
    }
    }
    totalrating = ((totalrating) / (totalreview)).toFixed(1)
    console.log(totalrating)
    res.render("admin/page/myaccount/edit",{
      product : products.length,
      totalrating : totalrating,
      totalreview : totalreview,
      dataaccount : account
    })

};
  
  // [PATCH] /admin/my-account/edit
module.exports.editpost = async (req, res) => {
    const id = res.locals.user.id;
    console.log(req.body)
    if(req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
   try {
    await Account.updateOne({
      _id: id
    }, req.body);
    req.flash("nice","Cập Nhật Thành Công")
    res.redirect("back")
   } catch (error) {
    req.flash("error","Cập Nhật Thất Bại")
    res.redirect("back");
   }
};


module.exports.money = async(req,res) => {
  if(Object.keys(req.query).length > 0){
    console.log(req.query.amount)
       await Account.updateOne({
         token : res.locals.user.token
       }, {$inc : {money : parseInt(req.query.amount)}})
       res.redirect("/admin/myaccount")
       return
  }
  res.render("admin/page/myaccount/money")
}

module.exports.lock = async(req,res) => {
  const id = res.locals.user.id;

  await Account.updateOne({
    _id: id
  }, {$set : {Licensing : false}});
  res.redirect("/auth/loginadmin")
 } 



module.exports.moneypost = async(req,res) => {

  var accessKey = 'F8BBA842ECF85';
  var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  var orderInfo = 'pay with MoMo';
  var partnerCode = 'MOMO';
  var redirectUrl = `http://localhost:3000/admin/myaccount/money`;
  var ipnUrl = `http://localhost:3000/admin/myaccount/money`;
  var requestType = "payWithMethod";
  var amount = parseInt(req.body.total);
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = '';
  var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
  var orderGroupId = '';
  var autoCapture = true;
  var lang = 'vi';

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------")
  console.log(rawSignature)
  //signature
  const crypto = require('crypto');
  var signature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
  console.log("--------------------SIGNATURE----------------")
  console.log(signature)

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature
  });
  //Create the HTTPS objects
  const https = require('https');
  const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody)
      }
  }
  //Send the request and get the response
  const request = https.request(options, response => {
      console.log(`Status: ${response.statusCode}`);
      console.log(`Headers: ${JSON.stringify(response.headers)}`);
      response.setEncoding('utf8');
      response.on('data', (body) => {
          console.log('Body: ');
          console.log(body);
          console.log('resultCode: ');
          console.log(JSON.parse(body).resultCode);

          // Check the resultCode and redirect the user if needed
          const resultCode = JSON.parse(body).resultCode;
          if (resultCode === 0) {
              const payUrl = JSON.parse(body).payUrl;
              console.log(req.query)
              res.redirect(payUrl);
          } else {
              // Handle errors if necessary
              res.status(500).send('Payment initiation failed');
          }
      });
  })

  request.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
      res.status(500).send('Payment initiation failed');
  });
  // write data to request body
  console.log("Sending....")
  request.write(requestBody);
  request.end();

}