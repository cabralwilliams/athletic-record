//Import modules
const router = require("express").Router();
const { User, Activity, Split, Comment } = require("../../models");

//Get all activities
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
        //console.log(activityData);
        res.json(activityData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Get a single activity
router.get("/:id", (req, res) => {
    Activity.findOne(
        {
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: User,
                    attributes: ["username"]
                },
                {
                    model: Split,
                    attributes: ["distance","duration","dist_type_id","group_id"]
                },
                {
                    model: Comment,
                    attributes: ["comment_text"],
                    include: [
                        {
                            model: User,
                            attributes: ["username"]
                        }
                    ]
                }
            ]
        }
    )
    .then(activityData => {
        res.json(activityData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
    Activity.create({
        title: req.body.title,
        description: req.body.description,
        act_date: req.body.act_date,
        distance: req.body.distance,
        duration: req.body.duration,
        effort_type_id: req.body.effort_type_id,
        type_id: req.body.type_id,
        dist_type_id: req.body.dist_type_id,
        user_id: req.body.user_id
    })
    .then(activityData => {
        res.json(activityData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;