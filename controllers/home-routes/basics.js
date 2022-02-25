//Import modules
const router = require("express").Router();
const { User, Activity, Split, Comment } = require("../../models");

router.get("/", (req, res) => {
    Activity.findAll({
        include: [
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
    .then(activityData => {
        let activities = activityData.map(activity => activity.get({ plain: true }));
        activities = activities.map(activity => {
            activity.act_date = activity.act_date.toString().substring(0,15);
            return activity;
        });
        //console.log(activities);
        //console.log(typeof activities[0].act_date);
        const loggedIn = req.session.loggedIn;
        res.render("home-page", {
            activities,
            loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
    if(req.session.loggedIn) {
        res.redirect("/dashboard");
    }
    res.render('login-page');
})

module.exports = router;