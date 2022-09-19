const express = require("express");
const mongoose = require("mongoose");
const usuarios = require("./routes/usuarios");
const cursos = require("./routes/cursos");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/usuarios", usuarios);
app.use("/api/cursos", cursos);

//! conexion mongo db
mongoose
  .connect("mongodb://localhost:27017/curso_mongo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Conexion exitosa");
  })
  .catch((err) => console.log(err));

app.listen(port, (res) => {
  console.log(res);
  console.log(`El server se esta ejecutando en http://localhost:${port}`);
});
