const express = require("express");
const cors = require("cors");
const analyticsRoutes = require("./routes/analytics.routes");
const teamRoutes = require("./routes/team.routes");

const app = express();
console.log("Team route mounted ✅");
console.log("Notification route mounted ✅");

app.use(cors());
app.use(express.json());
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/analytics", analyticsRoutes);
app.use("/api/time", require("./routes/time.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/team", teamRoutes);
app.use("/api/user", require("./routes/user.routes"));

// test route
app.get("/", (req, res) => {
  res.send("Smart Task Nest Backend Running 🚀");
});

module.exports = app;
