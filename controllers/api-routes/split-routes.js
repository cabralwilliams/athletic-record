//Import modules
const router = require("express").Router();
const { User, Activity, Split, Comment } = require("../../models");
const authorize = require('../../lib/auth');

router.get("/", (req, res) => {
    Split.findAll({
        include: [
            {
                model: Activity,
                attributes: ["title","description","act_date","distance","duration","type_id","dist_type_id"],
                include: [
                    {
                        model: User,
                        attributes: ["username"]
                    }
                ]
            }
        ]
    })
    .then(splitData => {
        res.json(splitData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Get a specific group of splits
router.get("/:group_id", (req, res) => {
    Split.findAll({
        where: {
            group_id: req.params.group_id
        },
        include: [
            {
                model: Activity,
                attributes: ["title","description","act_date"],
                include: [{
                    model: User,
                    attributes: ["username"]
                }]
            }
        ]
    })
    .then(splitGroupData => {
        if(!splitGroupData) {
            res.json({"message": `There is no split data with the group id ${req.params.group_id}`});
        } else {
            res.json(splitGroupData);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post("/", authorize, (req, res) => {
    Split.findAll()
    .then(splitData => {
        let group_id;
        if(splitData.length === 0) {
            //No split groups yet
            group_id = 1;
        } else {
            //Find the last created group_id and add 1 to this to set the next group_id
            group_id = splitData[splitData.length - 1].group_id + 1;
            //group_id = splitData[splitData.length - 1].dataValues.group_id + 1;
        }
        //Expect the body to be passed as an array in an object property called splits
        //Will bulkCreate these splits - all with the same group_id
        const splits = req.body.splits.map(split => {
            split.group_id = group_id;
            return split;
        });
        Split.bulkCreate(splits)
        .then(() => {
            res.json(splitData);
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

router.delete("/:activity_id", authorize, (req, res) => {
    Split.destroy({
        where: { activity_id: req.params.activity_id }
    })
    .then(dbResponse => {
        res.json(dbResponse);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;