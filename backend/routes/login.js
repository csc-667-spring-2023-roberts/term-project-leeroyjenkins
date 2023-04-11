const express = require("express");
const router = express.Router();
const { user } = require("../controller");

router.get("/", (req, res) => {
  user.login(req, res);
});

module.exports = router;
