const express = require("express")
const router = express.Router()
const products = require("../../controller/admin/products")
const validate = require("../../validate/admin/products")
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
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/upload')
//     },
//     filename: function (req, file, cb) {
//       const prefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, prefix + "-" + file.originalname);
//     }
//   })
const upload = multer()

router.get("/",products.index)
router.patch("/change/:action/:id",products.change)
router.patch("/changeall",products.changeall)
router.delete("/delete/:id",products.delete)
router.get("/create",products.create)
router.post("/createpost",upload.single("thumbnail"),image,validate.createpost,products.createpost)
router.get("/edit/:id",products.edit)
router.patch("/editpost",upload.single("thumbnail"),image,products.editpost)
module.exports = router;