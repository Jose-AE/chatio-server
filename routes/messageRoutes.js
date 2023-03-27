const express = require("express");
const router = express.Router();

const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

router.post("/savemessage", async (req, res) => {
  try {
    const message = await Message.create(req.body.message);
    await Chat.findByIdAndUpdate(req.body.chat._id, {
      $push: { messages: message },
      $set: { lastActive: Date.now() },
    });

    res.status(202).send("message saved");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get("/getchatmessages/:_id", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params._id).populate({
      path: "messages",
      populate: {
        path: "sender",
      },
    });

    res.status(202).send(chat.messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
