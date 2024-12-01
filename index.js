const express = require("express")
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const router = require("./router/client/mainrouter")
const routeradmin = require("./router/admin/main")
const routerauth = require("./router/auth/main")
const dotevn = require("dotenv")
const connect = require("./database/database")
const system = require("./setting/system")
const http = require('http');
const { Server } = require("socket.io");
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
dotevn.config();
const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);
global._io = io
app.use(bodyParser.urlencoded({ extended: false}))
app.use(methodOverride('_method'));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug")
app.use(cookieParser('KJJSLKASASASA'));
app.use(session({
    secret: 'ádasd',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true 
  }));
app.use(flash());
app.locals.prefixAdmin = system.prefixAdmin
app.use(express.static(`${__dirname}/public`));
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
router(app);
routeradmin(app);
routerauth(app);
connect.connect();
app.get("*", (req, res) => {
  res.render("client/page/errors/index", {
    pageTitle: "404 Not Found",
  });
});
server.listen(port, () => {
    console.log('Đây là app của tôi')
})