//Import necessary modules
const router = require("express").Router();
const { User, Comment, Activity, Split } = require("../../models");
const methods = require("../../lib/model-objects");

router.get("/", (req, res) => {
    User.findAll(
        {
            attributes: {
                exclude: ["password"]
            }
        }
    )
    .then(userData => {
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ["password"]
        },
        include: [
            {
                model: Activity,
                attributes: ["title","description","act_date","distance","duration","type_id","dist_type_id"]
            }
        ]
    })
    .then(userData => {
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    })
    .then(dbUserData => {
        //Leave room to deal with session information

        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
    User.findOne({
        where: { username: req.body.username }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: 'Incorrect credentials, please try again.' });
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect credentials, please try again.' });
            return;
        }

        //Successful login
        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
    
            res.json({ user: dbUserData, message: 'You are now logged in.' });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

module.exports = router;