const router = require('express').Router();
const { History, Lap } = require('../../models');

router.get("/", (req, res) => {
    History.findAll({
        include: [
            {
                model: Lap,
                attributes: ['distance','duration','dist_type_id','group_id']
            }
        ]
    })
    .then(historyData => {
        res.json(historyData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put("/edit/:id", (req, res) => {
    History.update(
        req.body,
        {
            where: { id: req.params.id }
        }
    )
    .then(updatedHistory => res.json(updatedHistory))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;