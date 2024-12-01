const express = require("express")
const router = express.Router();
const controllor = require("../../controller/client/sp")

router.get("/user/:id", controllor.index)


module.exports = router;