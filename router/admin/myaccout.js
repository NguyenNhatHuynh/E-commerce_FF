const express = require("express")
const router = express.Router()
const  myaccout = require("../../controller/admin/myaccout")
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
cloudinary.config({ 
    cloud_name: 'dkbvldq5r', 
    api_key: '884442743842924', 
    api_secret: 'koq9-2nqq9GekImg5SNMuw9DbLo' 
  });
  const image = (req, res, next) => {
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
        req.body.avatar = result.url
        next()
    }

    upload(req);
}

const upload = multer()
router.get("/",myaccout.index)

router.get("/money",myaccout.money)

router.post("/moneypost",myaccout.moneypost)

router.get("/edit",myaccout.edit)

router.patch("/editpost",upload.single("avatar"),image,myaccout.editpost)

router.post("/lock",myaccout.lock)

module.exports = router