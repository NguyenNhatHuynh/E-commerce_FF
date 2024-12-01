const express = require("express")
const router = express.Router();
const profile = require("../../controller/client/profile")

const multer = require('multer')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
cloudinary.config({ 
    cloud_name: 'dkbvldq5r', 
    api_key: '884442743842924', 
    api_secret: 'koq9-2nqq9GekImg5SNMuw9DbLo' 
  });
  const image = (req, res, next) => {
    console.log(req.file)
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
        req.body.avatar = result.url
        next()
    }

    upload(req);
  }
  else{
    next()
  }
}
const upload = multer()
router.get("/",profile.index)
router.patch("/editprofile",upload.single("avatar"),image,profile.indexpost)
router.post("/editinvoice/:id/:status",profile.handelinvoice)
module.exports = router;