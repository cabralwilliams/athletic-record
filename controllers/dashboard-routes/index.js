const router = require('express').Router();
const { User, Activity, Split, Comment, Follower } = require('../../models');
const authorize = require('../../lib/auth');
const helpers = require('../../lib/helpers');

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
            },
            {
                model: Follower
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
        let followeeIds = userData.followers.map(followee => followee.followee_id);
        User.findAll({
            where: {
                id: followeeIds
            },
            attributes: ["username","id"]
        })
        .then(followeeData => {
            userData.following = JSON.parse(JSON.stringify(followeeData));
            console.log(userData);
            res.render("dashboard-view", { username: req.session.username, loggedIn: true, userData });
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
});

router.get("/create", authorize, (req, res) => {
    res.render('create-activity', { user_id: req.session.user_id, loggedIn: true });
});

//Location where activity creator can manage data associated with a particular activity -> redirects to normal activity page if user isn't the one who created the activity
router.get("/activity/:id", authorize, (req, res) => {
    Activity.findOne({
        where: { id: req.params.id },
        include: [
            {
                model: User,
                attributes: ["id","username"]
            },
            {
                model: Split
            },
            {
                model: Comment,
                include: [
                    {
                        model: User,
                        attributes: ["username"]
                    }
                ]
            }
        ]
    })
    .then(activityData => {
        if(!activityData) {
            res.status(404).json({ message: "There is no activity with that id."});
        }
        const plainActivityData = activityData.get({ plain: true });
        plainActivityData.act_date = JSON.stringify(plainActivityData.act_date).slice(1,11);
        if(plainActivityData.user.id !== req.session.user_id) {
            res.redirect(`/activity/${req.params.id}`);
        } else {
            //Expected to be passed to processActivity
            //{ dist_type_id: formattedData.dist_type_id, distance: formattedData.distance, duration: formattedData.duration }
            const processedActivity = helpers.processActivity({ dist_type_id: plainActivityData.dist_type_id, distance: plainActivityData.distance, duration: plainActivityData.duration });
            let actionStr = `You `;
            switch(plainActivityData.type_id) {
                case 1:
                    actionStr += "biked";
                    break;
                case 2:
                    actionStr += "swam";
                    break;
                case 3:
                    actionStr += "walked";
                    break;
                case 4:
                    actionStr += "hiked";
                    break;
                default:
                    actionStr += "ran";
                    break;
            }
            actionStr += ` ${processedActivity.primary.distance} ${processedActivity.primary.unit1}`;
            //Details used to repopulate the form with data already saved
            plainActivityData.fullData = processedActivity;
            plainActivityData.distance = parseFloat(plainActivityData.distance);
            plainActivityData.duration = parseFloat(plainActivityData.duration);
            plainActivityData.actionStr = actionStr;
            const formData = {};
            const separatedTime = helpers.separateTime(plainActivityData.duration);
            formData.hours = separatedTime[0];
            formData.minutes = separatedTime[1];
            formData.seconds = separatedTime[2];
            const aType = { };
            aType.run = plainActivityData.type_id === 0;
            aType.bike = plainActivityData.type_id === 1;
            aType.swim = plainActivityData.type_id === 2;
            aType.walk = plainActivityData.type_id === 3;
            aType.hike = plainActivityData.type_id === 4;
            const eType = { };
            eType.easy = plainActivityData.effort_type_id === 0;
            eType.hard = plainActivityData.effort_type_id === 1;
            eType.race = plainActivityData.effort_type_id === 2;
            const dType = { };
            dType.miles = plainActivityData.dist_type_id === 0;
            dType.km = plainActivityData.dist_type_id === 1;
            dType.meters = plainActivityData.dist_type_id === 2;
            dType.yards = plainActivityData.dist_type_id === 3;
            formData.aType = aType;
            formData.eType = eType;
            formData.dType = dType;
            //res.json(plainActivityData);
            //Group the splits
            const splitGroups = {};
            for(let i = 0; i < plainActivityData.splits.length; i++) {
                let recorded = splitGroups.hasOwnProperty(`${plainActivityData.splits[i].group_id}`);
                if(!recorded) {
                    splitGroups[`${plainActivityData.splits[i].group_id}`] = [plainActivityData.splits[i]];
                } else {
                    splitGroups[`${plainActivityData.splits[i].group_id}`].push(plainActivityData.splits[i]);
                }
            }
            plainActivityData.hasSplits = plainActivityData.splits.length > 0;
            const splitArrays = [];
            for(const property in splitGroups) {
                let nextArr = [];
                for(let i = 0; i < splitGroups[property].length; i++) {
                    let nextSplit = helpers.processSplit(splitGroups[property][i]);
                    nextSplit.primary.splitNo = i;
                    nextArr.push(nextSplit);
                }
                splitArrays.push({group: [...nextArr], groupId: splitArrays.length });
            }
            res.render("activity-edit", { loggedIn: true, activityInfo: plainActivityData, formData, splitArrays });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
})
module.exports = router;