//Import modules
const router = require("express").Router();
const { User, Activity, Split, Comment, Follower } = require("../../models");

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

router.get("/users/:user_id", (req, res) => {
    const loggedIn = req.session.loggedIn;
    if(loggedIn && req.session.user_id === parseInt(req.params.user_id)) {
        res.redirect("/dashboard");
    }
    User.findOne({
        where: { id: req.params.user_id },
        attributes: ["username"],
        include: [
            {
                model: Activity,
                attributes: ["id","title","act_date","distance","duration","type_id","dist_type_id"],
                include: [
                    {
                        model: Split,
                        attributes: ["activity_id","distance","duration"]
                    }
                ]
            },
            {
                model: Follower
            }
        ]
    })
    .then(userData => {
        let plainUser = userData.get({ plain: true });
        for(let i = 0; i < plainUser.activities.length; i++) {
            switch(plainUser.activities[i].dist_type_id) {
                case 1:
                    plainUser.activities[i].units = "kilometers";
                    break;
                case 2:
                    plainUser.activities[i].units = "meters";
                    break;
                case 3:
                    plainUser.activities[i].units = "yards";
                    break;
                default:
                    plainUser.activities[i].units = "miles";
                    break;
            }
            if(plainUser.activities[i].splits.length > 0) {
                plainUser.activities[i].hasSplits = true;
            } else {
                plainUser.activities[i].hasSplits = false;
            }
        }
        
        Follower.findAll({
            where: {
                followee_id: req.params.user_id
            },
            attributes: ["follower_id"]
        })
        .then(followerData => {
            let plainFollowerData = JSON.parse(JSON.stringify(followerData));
            let areFollowing = false;
            
            for(let i = 0; i < plainFollowerData.length; i++) {
                if(req.session.user_id === plainFollowerData[i].follower_id) {
                    areFollowing = true;
                    break;
                }
            }
            res.render("user-view", { userData: plainUser, followerData, areFollowing, follower_id: req.session.user_id, loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

module.exports = router;