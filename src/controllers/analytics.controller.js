const Task = require("../models/Task.model");
const TimeLog = require("../models/TimeLog.model");

/* ================= TASK SUMMARY (ALREADY EXISTS) ================= */
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Task.countDocuments({ createdBy: userId });
    const completed = await Task.countDocuments({
      createdBy: userId,
      status: "Done",
    });
    const running = await Task.countDocuments({
      createdBy: userId,
      status: "Running",
    });
    const pending = await Task.countDocuments({
      createdBy: userId,
      status: "Pending",
    });

    res.json({ total, completed, running, pending });
  } catch (err) {
    res.status(500).json({ message: "Analytics error" });
  }
};

/* ================= ⏱ WEEKLY TIME ANALYTICS ================= */
exports.getWeeklyTimeAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // last 7 days including today
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    const logs = await TimeLog.find({
      user: userId,
      date: { $in: days },
    });

    // date-wise sum
    const map = {};
    logs.forEach((log) => {
      map[log.date] = (map[log.date] || 0) + log.duration;
    });

    const week = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];

    const response = days.map((date) => ({
      day: week[new Date(date).getDay()],
      seconds: map[date] || 0,
    }));

    res.json(response);
  } catch (err) {
    console.error("Weekly analytics error", err);
    res.status(500).json({ message: "Weekly analytics failed" });
  }
};

/* ================= 📅 TODAY TIME ================= */
exports.getTodayTime = async (req, res) => {
  try {
    const userId = req.user.id;

    // aaj ki date (YYYY-MM-DD)
    const today = new Date().toISOString().slice(0, 10);

    const logs = await TimeLog.find({
      user: userId,
      date: today,
    });

    // total seconds
    const totalSeconds = logs.reduce(
      (acc, log) => acc + log.duration,
      0
    );

    res.json({ seconds: totalSeconds });
  } catch (err) {
    console.error("Today analytics error", err);
    res.status(500).json({ message: "Today analytics failed" });
  }
};

/* ================= 🔥 HEATMAP ================= */
exports.getHeatmapData = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const days = [];

    // last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    const logs = await TimeLog.find({
      user: userId,
      date: { $in: days },
    });

    const map = {};
    logs.forEach((log) => {
      map[log.date] = (map[log.date] || 0) + log.duration;
    });

    const response = days.map((date) => ({
      date,
      seconds: map[date] || 0,
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Heatmap error" });
  }
};

/* ================= 🔥 STREAK ================= */
exports.getStreak = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const days = [];

    // last 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    const logs = await TimeLog.find({
      user: userId,
      date: { $in: days },
    });

    // map date → seconds
    const map = {};
    logs.forEach((log) => {
      map[log.date] = (map[log.date] || 0) + log.duration;
    });

    // 🔥 streak calculate
    let streak = 0;

    for (let date of days) {
      if (map[date] && map[date] > 0) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ streak });
  } catch (err) {
    console.error("Streak error", err);
    res.status(500).json({ message: "Streak failed" });
  }
};