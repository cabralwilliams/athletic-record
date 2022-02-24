const router = require('express').Router();
const { User, Activity } = require('../../models');
const authorize = require('../../lib/auth');

router.get("/", authorize, (req, res) => {
    
});

module.exports = router;