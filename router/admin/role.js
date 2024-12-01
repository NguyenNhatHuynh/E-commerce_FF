const express = require("express")
const router = express.Router()

const role = require("../../controller/admin/role")
router.get("/",role.index)

router.get("/create",role.create)

router.post("/createpost",role.createpost)

router.get("/edit/:id",role.edit)

router.patch("/editpost/:id",role.editpost)


module.exports = router