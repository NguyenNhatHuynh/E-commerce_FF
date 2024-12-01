const login = require("./login")
const loginuser = require("./loginuser")

module.exports = (app) => {
  app.use("/auth/loginadmin",login)
  app.use("/auth/loginuser",loginuser)
}