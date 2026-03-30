const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: String,
    read: {
      type: Boolean,
      default: false,
    },

    invite: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Invite",
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);