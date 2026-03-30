const mongoose = require("mongoose");

const timeLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    duration: {
      type: Number, // seconds
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TimeLog", timeLogSchema);
