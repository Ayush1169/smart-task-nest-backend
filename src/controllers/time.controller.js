const TimeLog = require("../models/TimeLog.model");

// 💾 SAVE TIME (FINAL WORK SAVE)
exports.saveTime = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId, duration } = req.body;

    if (!taskId || !duration || duration <= 0) {
      return res.status(400).json({
        message: "TaskId and valid duration required",
      });
    }

    const today = new Date().toISOString().slice(0, 10);

    let log = await TimeLog.findOne({
      user: userId,
      task: taskId,
      date: today,
    });

    if (log) {
      log.duration += duration;
      await log.save();
    } else {
      log = await TimeLog.create({
        user: userId,
        task: taskId,
        date: today,
        duration,
      });
    }

    res.json({
      message: "Time saved successfully",
      log,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Save failed" });
  }
};
