const mongoose = require("mongoose");
const schema = mongoose.Schema;

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: schema.Types.ObjectId,
    ref: "Usuario",
  },
  description: {
    type: String,
    required: true,
  },
  state: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    required: false,
  },
  students: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Curso", courseSchema);
