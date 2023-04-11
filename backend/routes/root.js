const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", (req, res) => {
  res.send("Home");
});

db.sequelize.sync();

module.exports = router;
