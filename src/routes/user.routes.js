const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const auth = require("../middleware/auth");

// 🔍 SEARCH USER BY USERNAME
router.get("/search", auth, async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    }).select("name email");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = router;