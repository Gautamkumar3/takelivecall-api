const UserModal = require("../modal/user");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  let { user_name, password } = req.body;
  if (!user_name || !password) {
    return res
      .status(400)
      .send({ status: "error", message: "User name or password is missing." });
  }
  try {
    let user = await UserModal.findOne({ user_name });
    if (user) {
      return res.status(409).send({
        status: "error",
        message:
          "This User name is already registered with us please change the user name",
      });
    } else {
      let newUser = new UserModal({ ...req.body });
      await newUser.save();
      return res.status(200).send({
        status: "success",
        message: "You are successfully registered.",
      });
    }
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

const userLogin = async (req, res) => {
  let { user_name, password } = req.body;
  if (!user_name || !password) {
    return res
      .status(400)
      .send({ status: "error", message: "User name or password is missing." });
  }
  try {
    const user = await UserModal.findOne({ user_name, password });
    if (!user) {
      return res
        .status(401)
        .send({ status: "error", message: "Invalid Credentials" });
    } else {
      let token = jwt.sign({ id: user._id, name: user.user_name }, secretKey, {
        expiresIn: "1 day",
      });

      return res.status(200).send({
        status: "success",
        message: "Login successfull",
        token: token,
        name: user.user_name,
      });
    }
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

module.exports = { registerUser, userLogin };
