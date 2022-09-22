const config = require("config");
const jwt = require("jsonwebtoken");

let verifyToken = (req, res, next) => {
  let token = req.get("Authorization");
  jwt.verify(token, config.get("configToken.seed"), (err, decoded) => {
    err ? res.status(401).json(err) : ((req.usuario = decoded.user), next());
  });
};

module.exports = { verifyToken };
