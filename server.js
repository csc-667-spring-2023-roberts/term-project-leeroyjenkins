const express = require("express");
const app = express();
const createError = require("http-errors");
const path = require("path");

require("dotenv").config()

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')
const requestTime = require("./backend/middleware/request-time")
const initSockets = require("./backend/sockets/init.js");


const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require("./backend/db/connection.js")

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const sessionMiddleware = session({
  store: new pgSession({pgPromise: db}),
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 4
  },
})

app.use(sessionMiddleware);
const server = initSockets(app, sessionMiddleware);

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

const isAuth = require('./backend/middleware/isAuth')
const isNotAuth = require('./backend/middleware/isNotAuth')
const rootRoutes = require("./backend/routes/root")
const homeRoutes = require('./backend/routes/home.js')
const gamesRoutes = require('./backend/routes/games')
const lobbyChatRoute = require('./backend/routes/lobbyChat')
const chatRoutes = require('./backend/routes/chat')

app.use("/", rootRoutes)
app.use('/home', homeRoutes)
app.use('/games', gamesRoutes)
app.use('/lobby-chat', lobbyChatRoute)
app.use('/chat', chatRoutes)


server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((request, response, next) => {
  next(createError(404));
});