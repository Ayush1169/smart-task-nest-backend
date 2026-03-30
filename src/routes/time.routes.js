const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/time.controller");

// 💾 ONLY ONE REAL API
router.post("/save", auth, controller.saveTime);

module.exports = router;
