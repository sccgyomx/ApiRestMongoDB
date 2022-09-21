const { validate } = require("../models/usuario_model");

module.exports = class Validation {
  constructor() {
    this.errors = {};
  }

  validateUser(user) {
    user.name === undefined
      ? (this.errors.name = "El nombre es requerido")
      : user.name.length < 3
      ? (this.errors.name = "El Nombre debe ser mayor a 3")
      : user.name.length > 50
      ? (this.errors.name = "El nombre debe ser menor a 50")
      : undefined;
    user.email === undefined
      ? (this.errors.email = "El correo es requerido")
      : /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(user.email)
      ? undefined
      : (this.errors.email = "Correo Invalido");

    user.password === undefined
      ? (this.errors.password = "La contraseña es requerida")
      : /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,20}$/.test(
          user.password
        )
      ? undefined
      : (this.errors.password =
          "Contiene al menos 8 caracteres y un máximo de 20 caracteres.\nContiene al menos un dígito.\nContiene al menos un alfabeto en mayúsculas.\nContiene al menos un alfabeto en minúscula.\nContiene al menos un carácter especial que incluye ! @ # $% & *() - + = ^ .\nNo contiene ningún espacio en blanco.");

    return Object.keys(this.errors).length > 0 ? this.errors : undefined;
  }

  validateCourse(course) {
    course.title === undefined
      ? (this.errors.title = "Eltitulo es requerido")
      : course.title.length < 3
      ? (this.errors.title = "El titulo debe ser mayor a 3")
      : course.title.length > 50
      ? (this.errors.title = "El titulo debe ser menor a 50")
      : undefined;

    course.description === undefined
      ? (this.errors.description = "La descripcion es requerida")
      : course.description.length > 250
      ? (this.errors.title = "La descripcion debe ser menor o igual a 250")
      : course.description.length < 3
      ? (this.errors.description =
          "La la descripcion debe ser mayor a 10 caracteres")
      : undefined;

    return Object.keys(this.errors).length > 0 ? this.errors : undefined;
  }
};
