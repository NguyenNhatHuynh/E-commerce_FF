const account = require("../../models/account")
const category = require("../../models/category")
const moment = require("moment")
require('moment-timezone'); // Import thư viện moment-timezone
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
const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    let result = "";
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return result;
  };
module.exports.index = async (req,res) => {
    const dataaccount = await account.find({ deleted: true }).sort({ createdAt: 1 });

    for(const item of dataaccount){
        item.time = moment(item.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY HH:mm:ss');
    }
    if(!dataaccount){
        dataaccount = null
    }
    res.render("admin/page/accountrv/index.pug",{
        dataaccount : dataaccount
    })
}


module.exports.check = async (req,res) => {
    console.log(req.params)
    const dataaccount = await account.findOne(
        { 
            _id : req.params.id,
            deleted: true 
        });
    if(dataaccount){
        const datacategory = await category.findOne({
            _id : dataaccount.category_id
        })
        dataaccount.title = datacategory.title
        console.log(datacategory)

    } 
    res.render("admin/page/accountrv/check.pug",{
        dataaccount : dataaccount
    })
}


module.exports.checkpost = async (req,res) => {
    const params = req.params.id
    const email = req.params.email
    console.log(email,params)
   if(params){
    const mkt = generateRandomString(8)
    await account.updateOne({
        email : email
    },{$set : {codeactive : mkt, deleted : false}})
    const subject = `Chúc Mừng Bạn Đã Đăng Ký Thành Công`;
    const content =  `
    <html>
    <head>
      <title>Chào mừng đến với Sàn Thương Mại Điện Tử của Chúng Tôi</title>
    </head>
    <body>
      <h1>NỘI QUY VỀ BÁN HÀNG TRÊN SÀN THƯƠNG MẠI ĐIỆN TỬ</h1>
      <p>Chào mừng các nhà bán hàng đến với sàn thương mại điện tử của chúng tôi! Để đảm bảo một môi trường mua bán trực tuyến tích cực và công bằng cho tất cả các bên liên quan, chúng tôi xác định các nội quy và hướng dẫn sau đây mà tất cả các nhà bán hàng cần tuân thủ:</p>
      <h2>1. Chất Lượng Sản Phẩm:</h2>
      <ul>
        <li><strong>Sản Phẩm Chất Lượng:</strong> Chỉ bán các sản phẩm chất lượng và phù hợp với mô tả đã cung cấp. Không bán các sản phẩm kém chất lượng hoặc hàng giả mạo.</li>
        <li><strong>Mô Tả Sản Phẩm Chân Thực:</strong> Cung cấp thông tin mô tả sản phẩm chân thực và đầy đủ, bao gồm hình ảnh, kích thước, vật liệu và tính năng của sản phẩm.</li>
      </ul>
      <h2>2. Giá Cả và Khuyến Mãi:</h2>
      <ul>
        <li><strong>Giá Cả Công Bằng:</strong> Đưa ra giá cả công bằng và không làm giảm giá hoặc tăng giá một cách không công bằng.</li>
        <li><strong>Không Lừa Đảo Khuyến Mãi:</strong> Không sử dụng các chiêu trò lừa đảo hoặc quảng cáo gian lận để thu hút khách hàng.</li>
      </ul>
      <h2>3. Giao Dịch và Giao Hàng:</h2>
      <ul>
        <li><strong>Thực Hiện Giao Dịch Đúng Hẹn:</strong> Thực hiện giao dịch và giao hàng đúng hẹn và trong tình trạng tốt nhất.</li>
        <li><strong>Chăm Sóc Khách Hàng:</strong> Cung cấp dịch vụ chăm sóc khách hàng chuyên nghiệp và nhanh chóng để giải quyết bất kỳ vấn đề nào phát sinh.</li>
      </ul>
      <h2>4. Bảo Mật Thông Tin:</h2>
      <ul>
        <li><strong>Bảo Mật Thông Tin Khách Hàng:</strong> Bảo vệ thông tin cá nhân và tài khoản của khách hàng. Không chia sẻ hoặc tiết lộ thông tin cá nhân của khách hàng cho bất kỳ ai ngoài người dùng.</li>
      </ul>
      <h2>5. Phản Hồi và Đánh Giá:</h2>
      <ul>
        <li><strong>Chấp Nhận Phản Hồi:</strong> Chấp nhận phản hồi từ khách hàng và sử dụng nó để cải thiện dịch vụ và sản phẩm.</li>
        <li><strong>Tích Cực Phản Hồi:</strong> Phản hồi tích cực và trả lời các câu hỏi hoặc khiếu nại của khách hàng một cách lịch sự và kịp thời.</li>
      </ul>
      <h2>6. Tuân Thủ Pháp Luật:</h2>
      <ul>
        <li><strong>Tuân Thủ Quy Định Pháp Luật:</strong> Tuân thủ tất cả các quy định và quy định pháp luật liên quan đến việc bán hàng trực tuyến.</li>
      </ul>
      <h2>7. Cạnh Tranh Công Bằng:</h2>
      <ul>
        <li><strong>Cạnh Tranh Tích Cực:</strong> Cạnh tranh dựa trên chất lượng sản phẩm và dịch vụ, không dùng các chiêu trò cạnh tranh không lành mạnh như đưa ra các bài viết giả mạo hoặc tấn công đối thủ cạnh tranh.</li>
      </ul>
      <h2>8. Không Spam:</h2>
      <ul>
      <li>Không Gửi Thư Rác: Không gửi email hoặc tin nhắn không được yêu cầu hoặc không mong muốn tới khách hàng. Tuân thủ các nội quy trên là quan trọng để xây dựng một cộng đồng bán hàng trực tuyến tích cực và an toàn. Cảm ơn bạn đã đọc và tuân thủ các quy định của chúng tôi</li>
      </ul>
      

     <h1 style="color : #007BFC;"> Mã Kích Hoạt Tài Khoản Của Bạn : ${mkt} </h1>
    `
    sendMail(email,subject,content)
   }
   res.redirect("/admin/accountreview")
}