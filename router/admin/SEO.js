const express = require("express")
const router = express.Router()
const SEO = require("../../controller/admin/SEO")

router.get("/",SEO.index)

router.get("/view/:id",SEO.view)

router.post("/descriptionshop",SEO.descriptionshop)

router.get("/updateword/:id/:word",SEO.keyword)
module.exports = router