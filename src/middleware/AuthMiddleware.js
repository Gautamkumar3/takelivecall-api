const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

const AuthMiddleware = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res
      .status(400)
      .send({ status: "error", message: "token is missing" });
  }
  try {
    jwt.verify(token, secretKey, (err, user) => {
      if (!err) {
        req.userId = user.id;
        req.user_name = user.name;
        next();
      } else {
        return res
          .status(403)
          .send({ status: "error", message: "invalid token" });
      }
    });
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

module.exports = AuthMiddleware;
