const {
  models: { User },
} = require("../models");

module.exports = {
  create: (req, res) => {
    // const { username, email, password } = req.body;
    username = "kim";
    name = username;
    email = "kim@gmail.com";
    password = "kimmy";

    User.create({
      name,
      username,
      email,
      password,
    })
      .then((user) => {
        res.send("User sucessfully registered");
      })
      .catch((err) => {
        res.status(500).send(err.message);
        console.log(err);
      });
  },
};
