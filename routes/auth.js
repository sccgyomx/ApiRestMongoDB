const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario_model");
const Validation = require("../services/validateServices");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
  const { email, password } = req.body;
  Usuario.findOne({ email: email })
    .then((user) => {
      Object.keys(user).length > 0
        ? bcrypt.compareSync(password, user.password)
          ? res.json({
              user: { _id: user._id, name: user.name, email: user.email },
              token: jwt.sign(
                { user: { _id: user._id, name: user.name, email: user.email } },
                config.get("configToken.seed"),
                { expiresIn: config.get("configToken.expiration") }
              ),
            })
          : res.status(400).json({ error: "Usuario o contraseña incorrecta" })
        : res.status(400).json({ error: "Usuario o contraseña incorrecta" });
    })
    .catch((err) => {
      res.status(400).json({ error: "Usuario o contraseña incorrecta " + err });
    });
});

module.exports = router;
