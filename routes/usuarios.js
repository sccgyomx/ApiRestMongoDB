const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario_model");
const Validation = require("../services/validateServices");
const bcrypt = require("bcrypt");
const middlewareAuth = require("../services/auth");

router.get("/", middlewareAuth.verifyToken, (req, res) => {
  let resultado = listUsers();
  resultado
    .then((usuarios) => {
      res.json(usuarios);
    })
    .catch((err) => res.status(400).json(err));
});

router.post("/", (req, res) => {
  let body = req.body;
  let validation = new Validation();

  Usuario.find({ email: body.email }, (err, users) => {
    let error = validation.validateUser(body);
    err
      ? (error.err = err)
      : Object.keys(users).length > 0
      ? (error.err = "Correo asignado a otra cuenta")
      : undefined;
    if (Object.keys(users).length === 0) {
      let resultado = addUser(body);
      resultado
        .then((user) => {
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(400).json(error);
    }
  });
});

router.put("/:id", middlewareAuth.verifyToken, (req, res) => {
  let body = req.body;
  let validation = new Validation();
  Usuario.find({ email: body.email }, (err, users) => {
    let error = validation.validateUser(body);
    err
      ? (error.err = err)
      : Object.keys(users).length > 0
      ? (error.err = "Correo asignado a otra cuenta")
      : undefined;
    if (Object.keys(users).length === 0) {
      let resultado = updateUser(req.params.id, body);
      resultado
        .then((user) => {
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(400).json(error);
    }
  });
});

router.delete("/:id", middlewareAuth.verifyToken, (req, res) => {
  let resultado = disableUser(req.params.id);
  resultado
    .then((user) => {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

async function listUsers() {
  let usuarios = await Usuario.find({
    state: true,
  }).select({ name: 1, email: 1 });
  return await usuarios;
}

async function addUser(body) {
  let usuario = new Usuario({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
  });

  return await usuario.save();
}

async function updateUser(id, body) {
  let usuario = await Usuario.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        name: body.name,
        email: body.email,
      },
    },
    { new: true }
  );
  return usuario;
}
async function disableUser(id) {
  let usuario = await Usuario.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        state: false,
      },
    },
    { new: true }
  );
  return usuario;
}

module.exports = router;
