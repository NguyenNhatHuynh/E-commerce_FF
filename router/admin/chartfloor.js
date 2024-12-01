const express = require("express")
const router = express.Router()
const chartfloor = require("../../controller/admin/chartfloor")

router.get("/",chartfloor.index)

module.exports = router