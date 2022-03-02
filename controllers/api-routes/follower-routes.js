const router = require('express').Router();
const { Follower } = require("../../models");
const authorize = require("../../lib/auth");

router.post("/", authorize, (req, res) => {
    console.log(`Reached the post route: `);
    console.log(req.body);
    Follower.create({
        follower_id: req.body.follower_id,
        followee_id: req.body.followee_id
    })
    .then(dbFollowerData => {
        res.json(dbFollowerData);
    })
    .catch(err => {
        console.error(`An error occurred when trying to create the follower relationship.\n${err}`);
    });
});

router.delete("/", authorize, (req, res) => {
    console.log(`Reached the delete route: `);
    console.log(req.body);
    Follower.destroy({
        where: { followee_id: req.body.followee_id, follower_id: req.body.follower_id }
    })
    .then(dbResponse => {
        res.json(dbResponse);
    })
    .catch(err => {
        console.error(`An error occurred when trying to destroy the follower relationship.\n${err}`);
    });
});

module.exports = router;