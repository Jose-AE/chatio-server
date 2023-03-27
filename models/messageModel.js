const mongoose = require("mongoose");

const messageModel = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
  timestamp: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Message", messageModel);
