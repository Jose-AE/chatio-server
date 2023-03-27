const mongoose = require("mongoose");

const userModel = mongoose.Schema({
  username: { type: "String", required: true, unique: true },
  password: { type: "String", required: true },
  pfp: {
    type: "String",
    required: true,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
});

module.exports = mongoose.model("User", userModel);
