//Import modules
const router = require("express").Router();
const basicRoutes = require("./basics");
const activityRoutes = require("./activity");
const dashboardRoutes = require("../dashboard-routes");

router.use("/", basicRoutes);
router.use("/activity", activityRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;