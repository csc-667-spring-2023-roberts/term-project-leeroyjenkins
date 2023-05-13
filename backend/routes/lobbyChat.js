const express = require("express");

const router = express.Router();

router.post("/", (request, response) => {
  const io = request.app.get("io");

  const { message } = request.body;
  const sender = request.session.user.username;

  io.emit("lobby-chat-message", { message, sender });
  response.sendStatus(200);
});

module.exports = router;