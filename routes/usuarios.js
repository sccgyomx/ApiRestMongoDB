const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const Usuario = require("../models/usuario_model");

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3.30}$/),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: {
      allow: ["com", "net"],
    },
  }),
});

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
  const { error, value } = userSchema.validate({
    name: body.name,
    email: body.email,
  });

  let resultado = addUser(body);

  if (!error) {
    resultado
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({
      error: error,
    });
  }
});

router.put("/:id", (req, res) => {
  let body = req.body;
  const { error, value } = userSchema.validate({
    name: body.name,
    email: body.email,
  });
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
    res.status(400).json({
      error: error,
    });
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
