const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

//middleware
const { verifyToken } = require("../middleware/verifyToken");

const User = require("../models/userModel");

function generateToken(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET);
}

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ username });

    // If user is not found, return error
    if (!user) {
      return res.status(401).send("Invalid username");
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (passwordMatches) {
      // Password is correct, log the user in
      res.status(200).json({ token: generateToken(username) });
    } else {
      // Password is incorrect, return error
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save the hashed password to the database

      await User.create({
        username,
        password: hashedPassword,
      });
      res.status(200).json({ token: generateToken(username) });
    } else {
      res.status(400).send("Username already in use");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post("/changepfp", verifyToken, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { username: req.user.username },
      {
        pfp: req.body.pfp,
      }
    );
    res.status(202).send("Avatar changed");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
