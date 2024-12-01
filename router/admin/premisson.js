const express = require("express")
const router = express.Router()
const premisson = require("../../controller/admin/premisson")
router.get("/",premisson.index)
router.patch("/handlepremisson",premisson.handlepremisson)

module.exports = router
