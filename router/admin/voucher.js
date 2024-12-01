const express = require("express")
const router = express.Router()
const voucher = require("../../controller/admin/voucher")
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
cloudinary.config({ 
    cloud_name: 'dkbvldq5r', 
    api_key: '884442743842924', 
    api_secret: 'koq9-2nqq9GekImg5SNMuw9DbLo' 
  });
  const image = (req, res, next) => {
    if(req.file){
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        req.body.thumbnail = result.url
        next()
    }

    upload(req);
  }
  else
  {
    next()
  }
}

const upload = multer()

router.get("/",voucher.index)

router.get("/create",voucher.create)

router.get("/deleted/:id",voucher.deleted)

router.post("/createpost",upload.single("thumbnail"),image,voucher.createpost)
module.exports = router