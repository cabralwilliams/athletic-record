const router = require("express").Router();
const userRoutes = require("./user-routes");
const activityRoutes = require("./activity-routes");
const splitRoutes = require("./split-routes");
const commentRoutes = require("./comment-routes");

router.use("/users", userRoutes);
router.use("/activities", activityRoutes);
router.use("/splits", splitRoutes);
router.use("/comments", commentRoutes);

module.exports = router;