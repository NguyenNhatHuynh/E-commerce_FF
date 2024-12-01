const express = require("express")
const router = express.Router()
const dashboard = require("../../controller/admin/dashboard")

router.get("/",dashboard.index)

module.exports = router