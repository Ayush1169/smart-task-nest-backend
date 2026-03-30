const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
    task: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Task",
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invite", inviteSchema);