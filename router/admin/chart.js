const express = require("express")
const router = express.Router()
const chart = require("../../controller/admin/chart")

router.get("/",chart.index)

module.exports = router