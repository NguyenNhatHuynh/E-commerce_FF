const login = require("./login")
const loginuser = require("./loginuser")
const authpasspord = require("./authpasspord")

module.exports = (app) => {
  app.use("/auth/loginadmin",login)
  app.use("/auth/loginuser",loginuser)
  app.use("/auth", authpasspord)
}