const express = require("express");
const { registerUser, userLogin } = require("../controller/user");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", userLogin);

module.exports = userRouter;
