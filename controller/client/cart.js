const products = require("../../models/products")
const cart = require("../../models/cart")
const accountshop = require("../../models/account")
const account = require("../../models/accountuser")
const bill = require("../../models/bill")
const detailbill = require("../../models/detailbill")
const momo = require("../../models/momo")
const voucher = require("../../models/voucher")
sendMail = (email, subject, content) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "nhutphi0122386@gmail.com",
            pass: "ekkyiudjsnlxjrrf"
        }
    });

    const mailOptions = {
        from: "nhutphi0122386@gmail.com",
        to: email,
        subject: subject,
        html: content
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
};
function getCurrentDateVietnam() {
    const vietnamTimezoneOffset = 7; // GMT+7 for Vietnam
    let now = new Date(); // Current date and time in user's timezone
    let localTime = now.getTime();
    let localOffset = now.getTimezoneOffset() * 60000; // convert to milliseconds
    let utc = localTime + localOffset;
    let vietnamTime = utc + (3600000 * vietnamTimezoneOffset);
    let vietnamDate = new Date(vietnamTime);

    // Format date as 'dd-mm-yyyy hh:mm:ss'
    let day = vietnamDate.getDate().toString().padStart(2, '0');
    let month = (vietnamDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
    let year = vietnamDate.getFullYear();
    let hours = vietnamDate.getHours().toString().padStart(2, '0');
    let minutes = vietnamDate.getMinutes().toString().padStart(2, '0');
    let seconds = vietnamDate.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

console.log(getCurrentDateVietnam());
function caculatorkm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Bán kính trái đất trong đơn vị kilômét

    const dLat = (lat2 - lat1) * Math.PI / 180; // Đổi độ sang radian
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Khoảng cách giữa hai điểm trong đơn vị kilômét
    return distance.toFixed(0);
}
module.exports.cartfeatured = async (req, res) => {
    console.log(req.params)
    const { shop, id } = req.params
    const infocart = {
        idsanpham: id,
        userid: req.cookies.tokenuser,
        quality: 1,
        shopid: shop
    }
    console.log(infocart)
    const check = await cart.findOne({
        idsanpham: id,
        userid: req.cookies.tokenuser,
        shopid: shop
    })
    console.log(check)
    if (!check) {
        const data = await cart(infocart)
        data.save()
        res.redirect("back")
    }
    else {
        console.log("Đã chạy vào đây")
        check.quality += 1
        await cart.updateOne({
            idsanpham: id,
            userid: req.cookies.tokenuser,
            shopid: shop
        }, check)
        res.redirect("back")
    }
}
module.exports.cartdetail = async (req, res) => {
    const { shop, id, quality } = req.params
    const dataproducts = await products.findOne({
        _id: id,
        shopid: shop
    })
    const newQuality = dataproducts.stock - quality;
    console.log(newQuality)
    if (newQuality < 0) {
        req.flash("error", "số lương không đủ")
        res.redirect("back")
        return
    }
    if (newQuality == 0) {
        await products.updateOne({
            _id: id,
            shopid: shop
        }, {
            $set: {
                stock: 0, 
                status: "inactive"
            }
        })
        res.redirect("back")
        return
    }
    if (dataproducts) {
        await products.updateOne({
            _id: id,
            shopid: shop
        }, { $set: { stock: newQuality } })
    }

    const infocart = {
        idsanpham: id,
        userid: req.cookies.tokenuser,
        quality: quality,
        shopid: shop
    }
    const check = await cart.findOne({
        idsanpham: id,
        userid: req.cookies.tokenuser,
        shopid: shop
    })
    console.log(check)
    if (!check) {
        const data = await cart(infocart)
        data.save()
        req.flash("nice", "Thêm Vào Giỏ Hàng Thành Công")
        res.redirect("back")
    }
    else {
        console.log("Đã chạy vào đây")
        check.quality += parseInt(quality)
        await cart.updateOne({
            idsanpham: id,
            userid: req.cookies.tokenuser,
            shopid: shop
        }, check)
        req.flash("nice", "Thêm Vào Giỏ Hàng Thành Công")
        res.redirect("back")
    }
}

module.exports.cartuser = async (req, res) => {
    let total = 0;
    const data = await cart.find({
        userid: req.cookies.tokenuser
    })
    for (const item of data) {
        const dataproduct = await products.findOne({
            _id: item.idsanpham
        })
        item.discountPercentage = dataproduct.discountPercentage
        // item.price = dataproduct.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        item.priceNew = ((dataproduct.price / 100) * (100 - dataproduct.discountPercentage)).toFixed(0);
        if (item.check == "1")
            total += parseInt(item.priceNew) * parseInt(item.quality)
        item.priceNew = item.priceNew.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ';
        item.title = dataproduct.title
        item.thumbnail = dataproduct.thumbnail
    }
    _io.once("connection", async (socket) => {
        socket.on("cliend_send_quality_cart", async (data) => {
            await cart.updateOne({
                idsanpham: data.idproduct,
                userid: req.cookies.tokenuser
            }, { $set: { quality: data.quality } })
            socket.emit("sever_render_dataquality_cart", {
                quality: data.quality,
                idproduct: data.idproduct,
                price: data.price,
                action: data.action
            })
        })
        socket.on("client_render_wanttodelete_cart", async (data) => {
            await cart.deleteOne({
                _id: data.id
            })
            socket.emit("sever_render_respond_cartdeleted", {
                id: data.id
            })
        })
        socket.on("client_render_check_cartuserclient", async (data) => {
            if (data.type == true) {
                await cart.updateOne({
                    _id: data.id,
                },
                    { $set: { check: 1 } }
                )
            } else {
                await cart.updateOne({
                    _id: data.id,
                },
                    { $set: { check: 0 } }
                )
            }
            socket.emit("sever_render_check_cartuserrespond", {
                type: data.type,
                id: data.id
            })
        })
    })
    //    total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'
    res.render("client/page/cart/index", {
        data: data,
        total: total
    })
}

module.exports.uquality = async (req, res) => {
    const { id, quality } = req.params
    await cart.updateOne({
        idsanpham: id,
        userid: req.cookies.tokenuser
    }, { $set: { quality: quality } })
    res.redirect("back")
}

module.exports.deletecart = async (req, res) => {
    console.log(req.params)
    const id = req.params.id
    console.log(id)

    await cart.deleteOne({
        _id: id
    })
    req.flash("nice", "đã xóa thành công")
    res.redirect("back")
}

module.exports.pay = async (req, res) => {

    let total = 0
    const data = await account.findOne({
        tokenuser: req.cookies.tokenuser
    })
    const datavoucher = await voucher.find({
            type : "public",
            status : "active"
    })
    const datacart = await cart.find({
        userid: req.cookies.tokenuser,
        check: "1"
    })
    for (const item of datacart) {
        const dataproduct = await products.findOne({
            _id: item.idsanpham
        })
        item.infor = dataproduct
        item.priceNew = ((dataproduct.price / 100) * (100 - dataproduct.discountPercentage)).toFixed(0);
        total += parseInt(item.priceNew) * parseInt(item.quality)

        const addresshop = await accountshop.findOne({
            token: item.shopid
        }).select("address")

        const km = caculatorkm(parseFloat(addresshop.address.latitude), parseFloat(addresshop.address.longitude), parseFloat(data.address.latitude), parseFloat(data.address.longitude))

        const priceship = parseFloat(km / 400 * 15000).toFixed(0)
        console.log(priceship)

        total += parseInt(priceship)
        item.shipreatime = priceship.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'
        item.totalchilren = (parseInt(item.priceNew) * parseInt(item.quality) + parseInt(priceship)).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'
        console.log()
        await cart.updateOne(
            { _id: item.id },
            { $set: { ship: priceship , totalcart : parseInt(item.totalchilren.replace(/\./g, ""))}  }
        )
    }
    let thevoucher = null
    let giamgia = 0
    if(req.query.id){
         thevoucher = await voucher.findOne({
            _id : req.query.id
        })
    }
  
    if(thevoucher != null){
        let checklimit = total / 100 * thevoucher.value
        console.log(checklimit,total)
        if(checklimit > thevoucher.limit){
            total = total - thevoucher.limit
            giamgia = thevoucher.limit
        }
        else{
            total = (total - checklimit.toFixed(0)).toFixed(0)
            giamgia = checklimit.toFixed(0)
        }
    }
    console.log(parseInt(total) + parseInt(giamgia))
    res.render("client/page/cart/oder", {
        data: data,
        datacart: datacart,
        total: total,
        datavoucher : datavoucher,
        giamgia : giamgia
    })
}

module.exports.paypost = async (req, res) => {
    let { fullName, city, phone, total, payment, address } = req.body
    total = total.replace(/\./g, "");

    total = parseInt(total);
    console.log(req.body)
 
    const datacart = await cart.find({
        userid: req.cookies.tokenuser,
        check: "1"
    })
    const newdata = []
    const idhoadon = []
    for(const item of datacart){
        const check = newdata.findIndex(itemchildren => itemchildren.shopid == item.shopid)
        if(check == -1){
            newdata.push(item)
        }
        else{
            console.log(newdata[check])
            newdata[check].totalcart += item.totalcart
        }
    }

    for(const item of newdata){
        const inforuser = {
            iduser: req.cookies.tokenuser,
            fullName: fullName,
            total: item.totalcart,
            Phone: phone,
            City: city,
            paymentMethod: payment,
            address: address,
            idshop : item.shopid,
            Time : getCurrentDateVietnam()
        
        }
        const data = new bill(inforuser)
        await data.save()    
        idhoadon.push(data.id)
        const datacartdetail = await cart.find({
            userid: req.cookies.tokenuser,
            check: "1",
            shopid : item.shopid
        })
        for (const itemchild of datacartdetail) {
            const infordetailbill = {
                idhoadon: data.id,
                idsanpham: itemchild.idsanpham,
                quality: itemchild.quality,
                shopid: itemchild.shopid,
                ship: itemchild.ship
            }
            const newdetail = new detailbill(infordetailbill)
            await newdetail.save()
        }
    }
  
   
   
    
		let sanphammail = "";
        let ship = 0
    for(const item of datacart)
    {
        ship += item.ship
        
        const dataproduct = await products.findOne({
            _id : item.idsanpham
        })
        sanphammail += "<tr>";

        sanphammail += "<td style=\"color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;word-wrap:break-word\">\r\n " +
            "<img style=\"width: 70px; height: 70px; object-fit: cover;\" src=\"" + dataproduct.thumbnail + "\">" +
            "</td>";
        sanphammail += "<td style=\"color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;word-wrap:break-word\">\r\n " + item.quality + "\t\t</td>";

        sanphammail += "<td style=\"color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;word-wrap:break-word\">\r\n " +
         (((dataproduct.price / 100) * (100 - dataproduct.discountPercentage)).toFixed(0) * item.quality).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ' + "\t\t</td>";
        sanphammail += "</tr>";

    }
    const datauser = await account.findOne({
        tokenuser: req.cookies.tokenuser
    })
    const subject = `Bạn Có Một Thông Báo Từ Sàn FFN`;
    const content = `
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
    <tbody>
        <tr>
            <td align="center" valign="top">
                <div></div>
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff;border:1px solid #dedede;border-radius:3px">
                    <tbody>
                        <tr>
                            <td align="center" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #007BFC; object-fit:cover;background-position:center;color:#ffffff;border-bottom:0;font-weight:bold;line-height:100%;vertical-align:middle;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;border-radius:3px 3px 0 0">
                                    <tbody>
                                        <tr>
                                            <td style="padding:36px 48px;display:block">
                                                <h1 style="font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;font-size:30px;font-weight:300;line-height:150%;margin:0;text-align:left;color:#ffffff;background-color:inherit">Đơn Hàng Mới Từ Sàn FFN</h1>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="600">
                                    <tbody>
                                        <tr>
                                            <td valign="top" style="background-color:#ffffff">
                                                <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td valign="top" style="padding:48px 48px 32px">
                                                                <div style="color:#636363;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;font-size:14px;line-height:150%;text-align:left">
                                                                    <p style="margin:0 0 16px">Bạn vừa có đơn hàng từ sàn FFN , chi tiết bên dưới:</p>
                                                                    <h2 style="color:#007BFC;display:block;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">
                                                                        <a href="#" style="font-weight:normal;text-decoration:underline;color:#007BFC" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://rarejuna.vn/wp-admin/post.php?post%3D4773%26action%3Dedit&amp;source=gmail&amp;ust=1656560185118000&amp;usg=AOvVaw2QhwJm1UcU7687gHkHSQ3N">Thời Gian</a> ${getCurrentDateVietnam()}
                                                                    </h2>
                                                                    <div style="margin-bottom:40px">
                                                                        <table cellspacing="0" cellpadding="6" border="1" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;width:100%;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th scope="col" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left">Sản phẩm</th>
                                                                                    <th scope="col" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left">Số lượng</th>
                                                                                    <th scope="col" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left">Giá</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                               ${sanphammail}
                                                                            </tbody>
                                                                            <tfoot>
                                                                                <tr>
                                                                                    <th scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left;border-top-width:4px">Nguyên giá:</th>
                                                                                    <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left;border-top-width:4px"><span>${(total - ship).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'}</span></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <th scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left">Phí Ship:</th>
                                                                                    <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"><span> ${ship.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'} <span>VND</span></span> <small></small></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <th scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left">Tổng cộng:</th>
                                                                                    <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"><span>${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'}</span></td>
                                                                                </tr>
                                                                            </tfoot>
                                                                        </table>
                                                                    </div>
                                                                    <table cellspacing="0" cellpadding="0" border="0" style="width:100%;vertical-align:top;margin-bottom:40px;padding:0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td valign="top" width="50%" style="text-align:left;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;border:0;padding:0">
                                                                                    <h2 style="color:#007BFC;display:block;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">Thông tin người nhận</h2>
                                                                                    <address style="padding:12px;color:#636363;border:1px solid #e5e5e5">${datauser.fullName}</address>
                                                                                </td>
                                                                                <td valign="top" width="50%" style="text-align:left;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;padding:0">
                                                                                    <h2 style="color:#007BFC;display:block;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">Địa chỉ giao hàng</h2>
                                                                                    <address style="padding:12px;color:#636363;border:1px solid #e5e5e5">${datauser.address.name}</address>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
    `;
 
    sendMail(datauser.email, subject, content);
    if (payment === "momo") {
        var accessKey = 'F8BBA842ECF85';
        var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        var orderInfo = 'pay with MoMo';
        var partnerCode = 'MOMO';
        var redirectUrl = `http://localhost:3000/cart/Notification/index/${idhoadon.join("'")}`;
        var ipnUrl = `http://localhost:3000/cart/Notification/index/${idhoadon.join("'")}`;
        var requestType = "payWithMethod";
        var amount = parseInt(total);
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
    else if (payment === "COD") {
        await cart.deleteMany({ userid: req.cookies.tokenuser, check: "1" });
        req.flash("nice,Thanh Toán Thành Công")
        res.redirect("/cart/Notification/index/null")

    }
};


module.exports.Notification = async(req, res) => {
    await cart.deleteMany({ userid: req.cookies.tokenuser, check: "1" });
    const { id } = req.params
    const newid = id.split("'")
    console.log(newid)
    if (id.length > 10) {
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature
        } = req.query;
        const data = new momo({
            idhoadon: newid,
            partnerCode,
            orderId,
            requestId,
            amount: parseInt(amount),
            orderInfo,
            orderType,
            transId,
            resultCode: parseInt(resultCode),
            message,
            payType,
            responseTime: parseInt(responseTime),
            extraData,
            signature
        });
        data.save(),
            console.log(id)
        console.log(req.query)
    }
    res.render("client/page/cart/Notification")
} 