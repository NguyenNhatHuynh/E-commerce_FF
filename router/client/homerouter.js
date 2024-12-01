const express = require("express")
const router = express.Router();
const home = require("../../controller/client/home")
router.get("/",home.index)

module.exports = router;