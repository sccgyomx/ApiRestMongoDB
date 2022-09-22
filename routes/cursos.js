const express = require("express");
const router = express.Router();
const Curso = require("../models/curso_model");
const Validation = require("../services/validateServices");
const middlewareAuth = require("../services/auth");
const { populate } = require("../models/curso_model");

router.get("/", middlewareAuth.verifyToken, (req, res) => {
  let resultado = listCourses();
  resultado
    .then((cursos) => {
      res.json(cursos);
    })
    .catch((err) => res.status(400).json(err));
});

router.post("/", middlewareAuth.verifyToken, (req, res) => {
  let body = req.body;
  let validation = new Validation();
  const error = validation.validateCourse(body);
  console.log(error);
  if (Object.keys(error).length === 0) {
    let resultado = addCourse(req);

    resultado
      .then((course) => {
        res.json(course);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json(error);
  }
});

router.put("/:id", middlewareAuth.verifyToken, (req, res) => {
  let body = req.body;
  let validation = new Validation();
  const error = validation.validateCourse(body);
  if (Object.keys(error).length === 0) {
    const error = validation.validateCourse(body);

    let resultado = updateCourse(req.params.id, body);
    resultado
      .then((Course) => {
        res.json(Course);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json(error);
  }
});

router.delete("/:id", middlewareAuth.verifyToken, (req, res) => {
  let resultado = disableCourse(req.params.id);
  resultado
    .then((Course) => {
      res.json(Course);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

async function listCourses() {
  let Courses = await Curso.find({
    state: true,
  }).populate("author", "name -_id");
  return await Courses;
}

async function addCourse(req) {
  console.log(req.body, req.usuario);
  let Course = new Curso({
    title: req.body.title,
    author: req.usuario._id,
    description: req.body.description,
  });
  return await Course.save();
}

async function updateCourse(id, body) {
  let Course = await Curso.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        title: body.title,
        description: body.description,
      },
    },
    { new: true }
  );
  return Course;
}
async function disableCourse(id) {
  let Course = await Curso.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        state: false,
      },
    },
    { new: true }
  );
  return Course;
}

module.exports = router;
