const express = require("express")
const router = express.Router()
const maintain = require("../../controller/admin/maintain")

router.get("/",maintain.index)

router.post("/handle/:id",maintain.indexpost)

module.exports = router