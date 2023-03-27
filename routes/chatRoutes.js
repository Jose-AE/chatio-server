const express = require("express");
const router = express.Router();

const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

router.get("/chats", async (req, res) => {
  const user = await User.findOne({ username: req.user.username });

  const chats = await Chat.find({
    participants: { $in: [user._id] },
  })
    .populate("participants")
    .populate({
      path: "messages",
      populate: {
        path: "sender",
      },
    });

  res.send({ chats, user });
});

///////////
router.post("/startchat", async (req, res) => {
  const user = await User.findOne({ username: req.user.username });

  if (req.body.isGroupChat === false) {
    const recipient = await User.findOne({ username: req.body.recipient });

    if (!recipient) {
      res.status(404).send("No one found with that username ");
    } else {
      if (recipient.username === user.username) {
        res.status(400).send("Cant start a chat with yourself");
      } else {
        const chat = await Chat.findOne({
          isGroupChat: false,
          participants: { $size: 2, $all: [user._id, recipient._id] },
        });

        if (!chat) {
          const chat = await Chat.create({
            isGroupChat: false,
            groupName: "",
            participants: [user, recipient],
            groupImage: "",
            messages: [],
            groupAdmins: [],
            lastActive: Date.now(),
          });

          res.status(201).send({ chat });
        } else {
          res.status(400).send("Chat already exists");
        }
      }
    }

    ///
  } else {
    let participants = [];
    let invalidParticipants = [];
    for (participant of [...new Set(req.body.participants)]) {
      const participantUser = await User.findOne({ username: participant });

      if (!participantUser) {
        invalidParticipants.push(participant);
      } else if (participantUser._id.toString() !== user._id.toString()) {
        participants.push(participantUser);
      }
    }

    if (participants.length > 0 && invalidParticipants.length === 0) {
      const chat = await Chat.create({
        isGroupChat: true,
        groupName: req.body.groupName,
        participants: [...participants, user],
        groupImage: req.body.image_url,
        messages: [],
        groupAdmins: [user],
        lastActive: Date.now(),
      });
      res.status(201).send({ chat });
    } else {
      res
        .status(400)
        .send("The folowing members don't exist: " + invalidParticipants);
    }
  }
});

module.exports = router;
