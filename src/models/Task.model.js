const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    status: {
      type: String,
      enum: ["Pending", "Running", "Done"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

  },
  { timestamps: true }

  

);

module.exports = mongoose.model("Task", taskSchema);
