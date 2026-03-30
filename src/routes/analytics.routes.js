const express = require("express");
const router = express.Router();
const {
  getSummary,
  getWeeklyTimeAnalytics,
  getTodayTime,
  getHeatmapData,
  getStreak

} = require("../controllers/analytics.controller");
const auth = require("../middleware/auth");

router.get("/summary", auth, getSummary);
// 🔥 NEW WEEKLY TIME GRAPH API
router.get("/weekly-time", auth, getWeeklyTimeAnalytics);
router.get("/today-time", auth, getTodayTime);
router.get("/heatmap", auth, getHeatmapData);
router.get("/streak", auth, getStreak);

module.exports = router;
