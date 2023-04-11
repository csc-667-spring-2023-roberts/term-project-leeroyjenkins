const {
  models: { User },
} = require("../models");

exports.register = (req, res) => {
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
    });
};

exports.login = (req, res) => {
  User.findAll({
    where: { id: 1 },
  })
    .then((user) => {
      let message = `Username: ${user[0].username}<br>
        Password: ${user[0].password}`;
      res.send(message);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};
