const express = require("express")
const router = express.Router()
const auth = require("../../controller/auth/login")
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
        req.body.cccd = result.url
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

router.get("/",auth.index)

router.post("/loginpost",auth.indexpost)

router.get("/forgotpassword",auth.forgotpassword)

router.post("/forgotpasswordpost",auth.forgotpasswordpost)

router.get("/forgotpasswordotp/:email",auth.forgotpasswordotp)

router.post("/forgotpasswordotppost",auth.forgotpasswordotppost)

router.get("/forgotpasswordreset",auth.forgotpasswordreset)

router.post("/forgotpasswordresetpost",auth.forgotpasswordresetpost)

router.get("/confim",auth.confim)

router.post("/confimpost",auth.confimpost)

router.get("/register",auth.register)

router.post("/registerpost",upload.single("cccd"),image,auth.registerpost)

router.get("/logout",auth.logout)

// router.get("/create",role.create)

// router.post("/createpost",role.createpost)

module.exports = router