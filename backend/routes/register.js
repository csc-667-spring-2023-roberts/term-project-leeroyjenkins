const express = require("express");
const router = express.Router();
const { user } = require("../controller");

router.get("/", (req, res) => {
  user.register(req, res);
});

module.exports = router;
