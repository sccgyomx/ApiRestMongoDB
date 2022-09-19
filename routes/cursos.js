const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    mensaje: "Get de cursos",
  });
});

module.exports = router;
