const express = require("express")
const router = express.Router()

const auth = require("../../controller/auth/loginuser")
router.get("/",auth.login)


router.post("/loginpost",auth.loginpost)

router.get("/register",auth.register)

router.get("/registerconfim",auth.registerconfim)

router.post("/registerconfimpost",auth.registerconfimpost)

router.post("/registerpost",auth.registerpost)

router.get("/logout",auth.logout)

module.exports = router
