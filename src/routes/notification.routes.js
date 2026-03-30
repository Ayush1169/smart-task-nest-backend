const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Notification = require("../models/Notification.model");

// get notifications
router.get("/", auth, async (req, res) => {
  const notifs = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json(notifs);
});

// mark as read
router.post("/read", auth, async (req, res) => {
  const { id } = req.body;

  await Notification.findByIdAndUpdate(id, { read: true });

  res.json({ message: "Marked as read" });
});

module.exports = router;