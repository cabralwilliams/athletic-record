//Import modules
const router = require("express").Router();
const apiRoutes = require("./api-routes");
const homeRoutes = require("./home-routes");
const historyRoutes = require("./history-routes");

router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/history", historyRoutes);

module.exports = router;