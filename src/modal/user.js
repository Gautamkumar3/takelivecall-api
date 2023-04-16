const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  user_name: {
    type: String,
    required: [true, "user name is missing"],
    unique: true,
  },
  password: { type: String, required: [true, "password is missing"] },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
