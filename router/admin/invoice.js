const express = require("express")
const router = express.Router()
const invoice = require("../../controller/admin/invoice")

router.get("/",invoice.index)

router.get("/detail/:id",invoice.detail)

router.get("/detailmomo/:id",invoice.detailmomo)

router.get("/status/:id",invoice.status)

router.post("/status/:id/:status",invoice.statuspost)

router.post("/checkinvoice/:id",invoice.checkinvoice)

router.post("/cancel/:id",invoice.cancel)
module.exports = router