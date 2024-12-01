const express = require("express")
const router = express.Router()
const checkproducts = require("../../controller/admin/checkproducts")

router.get("/",checkproducts.index)

router.get("/check/:id",checkproducts.indexpost)

router.post("/check",checkproducts.check)

module.exports = router