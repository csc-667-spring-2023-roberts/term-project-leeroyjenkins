const express = require("express");
const app = express();
const createError = require("http-errors");
const path = require("path");

require("dotenv").config()

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')
const requestTime = require("./backend/middleware/request-time")


const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require("./backend/db/connection.js")

const passport = require('passport')
require('./backend/config/passport')(passport)


const sessionStore = new pgSession({
  pool: db,
  pgPromise: db,
  tableName: 'sessions'
})

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 4
  },
  rolling: true
}))
app.use(passport.initialize())
app.use(passport.session())


if (process.env.NODE_ENV === "development") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");
  
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "backend", "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  
  app.use(connectLiveReload());
}
app.use(express.json())
app.set("views", path.join(__dirname, "backend", "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "backend", "static")));
app.use(requestTime);

const PORT = process.env.PORT || 3002;

const rootRoutes = require("./backend/routes/root")
const homeRoutes = require('./backend/routes/home.js')

app.use("/", rootRoutes)
app.use('/home', homeRoutes)

// app.use((request, response, next) => {
//   next(createError(404));
// });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
