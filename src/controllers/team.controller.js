const Team = require("../models/Team.model");
const Invite = require("../models/Invite.model");
const User = require("../models/User.model")
const Notification = require("../models/Notification.model");;

/* ================= CREATE TEAM ================= */
exports.createTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    const team = await Team.create({
      name,
      owner: userId,
      members: [{ user: userId, role: "admin" }],
    });

    res.json(team);
  } catch (err) {
    res.status(500).json({ message: "Create team failed" });
  }
};

/* ================= GET MY TEAMS ================= */
exports.getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    const teams = await Team.find({
      "members.user": userId,
    }).populate("members.user", "email");

    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Fetch teams failed" });
  }
};



/* ================= INVITE TO TEAM ================= */

exports.sendInvite = async (req, res) => {
  try {
    const { teamId, email, taskId } = req.body;
    const userId = req.user.id;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    const team = await Team.findById(teamId);
    const sender = await User.findById(userId);

    const invite = await Invite.create({
      team: teamId,
      to: user._id,
      from: userId,
      task: taskId,
    });

    // 🔔 NOTIFICATION CREATE
    await Notification.create({
      user: user._id,
      message: `${sender.email} invited you to join ${team.name} 👥`,
        invite: invite._id,
    });

    res.json({ message: "Invite + Notification sent ✅", invite });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Invite failed" });
  }
};

/* ================= GET INVITES ================= */
exports.getMyInvites = async (req, res) => {
  try {
    const userId = req.user.id;

    const invites = await Invite.find({
      to: userId,
      status: "pending",
    }).populate("team", "name");

    res.json(invites);
  } catch (err) {
    res.status(500).json({ message: "Fetch invites failed" });
  }
};

/* ================= ACCEPT INVITE ================= */
exports.acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.body;
    const userId = req.user.id;

    const invite = await Invite.findById(inviteId);

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    const team = await Team.findById(invite.team);

    team.members.push({
      user: userId,
      role: "member",
    });

    await team.save();

    const Task = require("../models/Task.model");

// 🔥 TASK ASSIGN LOGIC
if (invite.task) {
  const task = await Task.findById(invite.task);

  if (task) {
    task.assignedTo.push(userId);
    await task.save();
  }
}
    invite.status = "accepted";
    await invite.save();

    res.json({ message: "Joined team ✅" });
  } catch (err) {
    res.status(500).json({ message: "Accept failed" });
  }
};