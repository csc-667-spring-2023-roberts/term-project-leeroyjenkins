const express = require("express");
const createError = require("http-errors");
const path = require("path");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const requestTime = require("./backend/middleware/request-time");

const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
require("dotenv").config()

const db = require("./backend/db/connection.js")
const passport = require('passport')


const app = express();
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

const sessionStore = new pgSession({
  pool: db,
  tableName: 'sessions'
})
// db.none(`CREATE TABLE IF NOT EXISTS sessions (
//     sid varchar NOT NULL COLLATE "default",
//     sess json NOT NULL,
//     expire timestamp(6) NOT NULL
//   ) WITH (OIDS=FALSE);
//   ALTER TABLE sessions ADD CONSTRAINT "session_pkey" PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;
//   CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions ("expire");`)
//   .then(() => {
//     console.log('Sessions table created successfully');
//   })
//   .catch(error => {
//     console.log('Error creating sessions table:', error);
//   });

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {maxAge: 1000 * 60 * 60 * 4}
}))
require('./backend/config/passport')
app.use(passport.initialize())
app.use(session())

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "backend", "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "backend", "static")));
app.use(requestTime);

const PORT = process.env.PORT || 3002;

const testRoutes = require("./backend/routes/test/index.js")
const rootRoutes = require("./backend/routes/root");

app.use("/", rootRoutes);
app.use("/test", testRoutes);

app.use((request, response, next) => {
  next(createError(404));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
