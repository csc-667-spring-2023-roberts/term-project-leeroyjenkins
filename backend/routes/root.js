const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", (req, res) => {
  // const sqlInsert = `INSERT INTO account (name, username, password, email) VALUES ('kim', 'KimJohn', 'KimmyKon', 'KimJohn@gmail.com');`;
  // db.query(sqlInsert, (err, result) => {
  //   console.log(err);
  //   res.send(result);
  // });
  res.send("A");
});

db.sequelize.sync();

module.exports = router;
