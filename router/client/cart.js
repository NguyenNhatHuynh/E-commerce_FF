const express = require("express")
const router = express.Router();
const praviepay = require("../../middlewares/client/privetepay")
const controllor = require("../../controller/client/cart")
const pravite = require("../../middlewares/client/praviteclient")
const pravitechat = require("../../middlewares/client/pravitechat")
router.post("/featured/:shop/:id", controllor.cartfeatured)
router.post("/detail/:shop/:id/:quality", pravitechat,controllor.cartdetail)

router.get("/cartuser",pravite,controllor.cartuser)
// router.get("/cartuser/:id/:quality",controllor.uquality)
// router.get("/cartuser/:id",controllor.deletecart)

router.get("/oder/pay",praviepay,controllor.pay)
router.post("/oder/pay",controllor.paypost)

router.get("/Notification/index/:id",controllor.Notification)
module.exports = router;