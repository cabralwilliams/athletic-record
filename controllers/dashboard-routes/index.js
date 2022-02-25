const router = require('express').Router();
const { User, Activity, Split } = require('../../models');
const authorize = require('../../lib/auth');

router.get("/", authorize, (req, res) => {
    User.findOne({
        where: { username: req.session.username },
        attributes: ["username","email"],
        include: [
            {
                model: Activity,
                attributes: ["id","title","description","act_date","distance","duration","type_id","dist_type_id"],
                include: [
                    {
                        model: Split,
                        attributes: ["group_id"]
                    }
                ]
            }
        ]
    })
    .then(dbUserdata => {
        //Have to remember to convert to useable data following successful request
        const userData = dbUserdata.get({ plain: true });
        const hasSplitsArr = userData.activities.map(activity => activity.splits.length > 0 );
        for(let i = 0; i < userData.activities.length; i++) {
            userData.activities[i].act_date = userData.activities[i].act_date.toString();
            userData.activities[i].hasSplits = hasSplitsArr[i];
            let distUnits;
            switch(userData.activities[i].dist_type_id) {
                case 1:
                    distUnits = "km";
                    break;
                case 2:
                    distUnits = "meters";
                    break;
                case 3:
                    distUnits = "yards";
                    break;
                default:
                    distUnits = "miles";
                    break;
            }
            userData.activities[i].units = distUnits;
            let actType;
            switch(userData.activities[i].type_id) {
                case 1:
                    actType = "Bike Ride";
                    break;
                case 2:
                    actType = "Swim";
                    break;
                case 3:
                    actType = "Walk";
                    break;
                case 4:
                    actType = "Hike";
                    break;
                default:
                    actType = "Run";
                    break;
            }
            userData.activities[i].activity_type = actType;
        }
        // console.log(userData);
        res.render("dashboard-view", { username: req.session.username, loggedIn: true, userData });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get("/create", authorize, (req, res) => {
    res.render('create-activity', { user_id: req.session.user_id, loggedIn: true });
});

module.exports = router;