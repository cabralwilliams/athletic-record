//Import modules
const router = require("express").Router();
const { User, Activity, Split, Comment } = require("../../models");

//Get all comments
router.get("/", (req, res) => {
    Comment.findAll({
        attributes: ["comment_text"],
        include: [
            {
                model: Activity,
                attributes: ["id","title","description","act_date"],
                include: [
                    {
                        model: User,
                        attributes: ["username"]
                    }
                ]
            },
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
    .then(commentData => {
        res.json(commentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Get comments related to a single activity_id
router.get("/:activity_id", (req, res) => {
    Comment.findAll({
        where: {
            activity_id: req.params.activity_id
        },
        attributes: ["comment_text"],
        include: [
            {
                model: Activity,
                attributes: ["title","description","act_date"],
                include: [
                    {
                        model: User,
                        attributes: ["username"]
                    }
                ]
            },
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
    .then(commentData => {
        res.json(commentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Post a comment
router.post("/", (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        activity_id: req.body.activity_id,
        user_id: req.body.user_id
    })
    .then(commentData => {
        res.json(commentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;