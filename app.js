const express = require("express");
const mongoose = require("mongoose");
const usuarios = require("./routes/usuarios");
const cursos = require("./routes/cursos");
const auth = require("./routes/auth");
const config = require("config");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/usuarios", usuarios);
app.use("/api/cursos", cursos);
app.use("/api/auth", auth);

//! conexion mongo db
mongoose
  .connect(config.get("configDB.host"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Conexion exitosa");
  })
  .catch((err) => console.log(err));

app.listen(port, (res) => {
  console.log(`El server se esta ejecutando en http://localhost:${port}`);
});
