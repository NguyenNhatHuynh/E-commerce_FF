const express = require("express")
const router = express.Router()
const checkedinvoice = require("../../controller/admin/checkedinvoice")

router.get("/",checkedinvoice.index)

router.post("/handleinvoice/:id",checkedinvoice.indexpost)
module.exports = router