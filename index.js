const express = require("express");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const router = require("./router/client/mainrouter");
const routeradmin = require("./router/admin/main");
const routerauth = require("./router/auth/main");
const dotevn = require("dotenv");
const connect = require("./database/database");
const system = require("./setting/system");
const http = require('http');
const { Server } = require("socket.io");
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

dotevn.config();

const app = express();
const port = process.env.PORT || 3000; // Sử dụng port từ .env nếu có
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

// Cấu hình session với Redis
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'your-secret',
  cookie: { secure: false, maxAge: 3600000 },
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(cookieParser('KJJSLKASASASA'));
app.use(flash());
app.locals.prefixAdmin = system.prefixAdmin;

app.use(express.static(`${__dirname}/public`));
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Định nghĩa các routes
router(app);
routeradmin(app);
routerauth(app);

// Kết nối cơ sở dữ liệu
connect.connect();

// Xử lý lỗi 404
app.get("*", (req, res) => {
  res.render("client/page/errors/index", {
    pageTitle: "404 Not Found",
  });
});

server.listen(port, () => {
    console.log(`App đang chạy tại http://localhost:${port}`);
});
