const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const Usuario = require("../models/usuario_model");
const Validation = require("../services/validateServices");

router.get("/", (req, res) => {
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
  const error = validation.validateUser(body);

  if (!error) {
    let resultado = addUser(body);
    resultado
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json(error);
  }
});

router.put("/:id", (req, res) => {
  let body = req.body;
  let validation = new Validation();
  const error = validation.validateUser(body);
  if (!error) {
    let resultado = updateUser(req.params.id, body);
    resultado
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json(error);
  }
});

router.delete("/:id", (req, res) => {
  let resultado = disableUser(req.params.id);
  resultado
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

async function listUsers() {
  let usuarios = await Usuario.find({
    state: true,
  });
  return await usuarios;
}

async function addUser(body) {
  let usuario = new Usuario({
    name: body.name,
    email: body.email,
    password: body.password,
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
