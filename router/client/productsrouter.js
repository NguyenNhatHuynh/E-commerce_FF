const express = require("express");
const router = express.Router();
const controllor = require("../../controller/client/productscontroller");
const seach = require("../../middlewares/client/seach")
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
cloudinary.config({
  cloud_name: "dkbvldq5r",
  api_key: "884442743842924",
  api_secret: "koq9-2nqq9GekImg5SNMuw9DbLo",
});
const image = (req, res, next) => {
  if (req.files && req.files.length > 0) {
    console.log(req.files);
    let uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    Promise.all(uploadPromises)
      .then((results) => {
        req.body.images = results.map((item) => item.url);
        next();
      })
      .catch((error) => {
        console.error("Error uploading images:", error);
        next(error);
      });
  } else {
    next();
  }
};
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/upload')
//     },
//     filename: function (req, file, cb) {
//       const prefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, prefix + "-" + file.originalname);
//     }
//   })
const upload = multer();

router.get("/index/:data",controllor.index);
router.get("/detail/:slug", controllor.detail);
router.post("/middle",seach.index)
router.post(
  "/submitcontent",
  upload.array("images"),
  image,
  controllor.submitcontent
);

module.exports = router;
