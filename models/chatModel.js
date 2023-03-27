const mongoose = require("mongoose");

const chatModel = mongoose.Schema({
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  groupName: {
    type: String,
    default: "My Group",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  groupImage: {
    type: "String",
    required: false,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  groupAdmins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lastActive: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("chat", chatModel);
