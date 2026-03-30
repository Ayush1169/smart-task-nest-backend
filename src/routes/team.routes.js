const express = require("express");
const router = express.Router();

const {
  createTeam,
  getMyTeams,
    sendInvite,
    getMyInvites,
    acceptInvite
} = require("../controllers/team.controller");

const auth = require("../middleware/auth");
console.log("Team routes file loaded 🚀");

/* ================= ROUTES ================= */
router.post("/create", auth, createTeam);
router.get("/", auth, getMyTeams);
router.post("/invite", auth, sendInvite);
router.get("/invites", auth, getMyInvites);
router.post("/accept", auth, acceptInvite);

module.exports = router; 