const router = require('express').Router();
const { History, Lap } = require('../../models');
const authorize = require('../../lib/auth');
const helpers = require("../../lib/helpers");

function processActivity(activityInfo) {
    let distInt = parseInt(activityInfo.dist_type_id);
    let output = { primary: null, secondary: null, tertiary: null, quaternary: null };
    let aTime = parseFloat(activityInfo.duration);
    let dMi, dKm, dMe, dYd, pMi, pKm, pMe, pYd;
    let primary, secondary, tertiary, quaternary;
    switch(distInt) {
        case 1:
            //Kilometers
            dKm = parseFloat(activityInfo.distance);
            dMi = helpers.getMiles(dKm,distInt);
            dMe = helpers.getMeters(dKm,distInt);
            dYd = helpers.getYards(dKm,distInt);
            break;
        case 2:
            //Meters
            dMe = parseFloat(activityInfo.distance);
            dMi = helpers.getMiles(dMe,distInt);
            dKm = helpers.getKilometers(dMe,distInt);
            dYd = helpers.getYards(dMe,distInt);
            break;
        case 3:
            //Yards
            dYd = parseFloat(activityInfo.distance);
            dMi = helpers.getMiles(dYd,distInt);
            dKm = helpers.getKilometers(dYd,distInt);
            dMe = helpers.getMeters(dYd,distInt);
            break;
        default:
            //Miles
            dMi = parseFloat(activityInfo.distance);
            dMe = helpers.getMeters(dMi,distInt);
            dKm = helpers.getKilometers(dMi,distInt);
            dYd = helpers.getYards(dMi,distInt);
            break;
    }
    pMi = aTime/dMi;
    pKm = aTime/dKm;
    pMe = dMe/aTime;
    pYd = dYd/aTime;
    const miles = { distance: dMi, pace: pMi, unit1: "miles", unit2: "minutes/mile" };
    const kilometers = { distance: dKm, pace: pKm, unit1: "kilometers", unit2: "minutes/km" };
    const meters = { distance: dMe, pace: pMe, unit1: "meters", unit2: "meters/second" };
    const yards = { distance: dYd, pace: pYd, unit1: "yards", unit2: "yards/second" };
    switch(distInt) {
        case 1:
            primary = kilometers;
            secondary = miles;
            tertiary = meters;
            quaternary = yards;
            break;
        case 2:
            primary = meters;
            secondary = yards;
            tertiary = kilometers;
            quaternary = miles;
            break;
        case 3:
            primary = yards;
            secondary = meters;
            tertiary = miles;
            quaternary = kilometers;
            break;
        default:
            primary = miles;
            secondary = kilometers;
            tertiary = meters;
            quaternary = yards;
            break;
    }
    output.rawStats = [primary,secondary,tertiary,quaternary,{ distance: activityInfo.distance, duration: activityInfo.duration }];
    output.primary = primary;
    output.secondary = secondary;
    output.tertiary = tertiary;
    output.quaternary = quaternary;
    return output;
}
//Formats the split statistics for a particular activity
//code 0 = miles, code 1 = km, code 2 = meters, code 3 = yards
function processSplit(splitInfo) {
    let distInt = parseInt(splitInfo.dist_type_id);
    let output = { miles: null, km: null, yards: null, meters: null, primary: null };
    let dMi, dKm, dMe, dYd, tMi, tKm, tMe, tYd;
    let primary;
    switch(distInt) {
        case 1:
            //Given in kilometers
            dKm = parseFloat(splitInfo.distance);
            dMi = helpers.getMiles(dKm,distInt);
            dMe = helpers.getMeters(dKm,distInt);
            dYd = helpers.getYards(dKm,distInt);
            tKm = parseFloat(splitInfo.duration)/dKm;
            tMi = tKm/dMi*dKm;
            tMe = tKm/dMe*dKm;
            tYd = tKm/dYd*dKm;
            primary = "km";
            break;
        case 2:
            //Given in meters
            dMe = parseFloat(splitInfo.distance);
            dMi = helpers.getMiles(dMe,distInt);
            dKm = helpers.getKilometers(dMe,distInt);
            dYd = helpers.getYards(dMe,distInt);
            tMe = parseFloat(splitInfo.duration)/dMe;
            tMi = tMe/dMi*dMe;
            tKm = tMe/dKm*dMe;
            tYd = tMe/dYd*dMe;
            primary = "meters";
            break;
        case 3:
            //Given in yards
            dYd = parseFloat(splitInfo.distance);
            dMi = helpers.getMiles(dYd,distInt);
            dKm = helpers.getKilometers(dYd,distInt);
            dMe = helpers.getMeters(dYd,distInt);
            tYd = parseFloat(splitInfo.duration)/dYd;
            tMi = tYd/dMi*dYd;
            tKm = tYd/dKm*dYd;
            tMe = tYd/dMe*dYd;
            primary = "yards";
            break;
        default:
            //Given in miles
            dMi = parseFloat(splitInfo.distance);
            dYd = helpers.getYards(dMi,distInt);
            dKm = helpers.getKilometers(dMi,distInt);
            dMe = helpers.getMeters(dMi,distInt);
            tMi = parseFloat(splitInfo.duration)/dMi;
            tYd = tMi/dYd*dMi;
            tKm = tMi/dKm*dMi;
            tMe = tMi/dMe*dMi;
            primary = "miles";
            break;
    }
    output.miles = { distance: dMi.toFixed(3), time: helpers.formatTime(tMi), pace: tMi.toFixed(3), data: [dMi,tMi,tMi], unit1: "miles", unit2: "minutes/mile", formatTheTime: true };
    output.km = { distance: dKm.toFixed(3), time: helpers.formatTime(tKm), pace: tKm.toFixed(3), data: [dKm,tKm,tKm], unit1: "kilometers", unit2: "minutes/km", formatTheTime: true };
    output.meters = { distance: dMe.toFixed(1), time: helpers.formatTime(tMe), pace: (1/tMe).toFixed(3), data: [dMe,tMe,1/tMe], unit1: "meters", unit2: "meters/second", formatTheTime: false };
    output.yards = { distance: dYd.toFixed(1), time: helpers.formatTime(tYd), pace: (1/tYd).toFixed(3), data: [dYd,tYd,1/tYd], unit1: "yards", unit2: "yards/second", formatTheTime: false };
    switch(primary) {
        case "km":
            output.primary = output.km;
            output.secondary = [output.miles,output.meters,output.yards];
            break;
        case "meters":
            output.primary = output.meters;
            output.secondary = [output.yards,output.km,output.miles];
            break;
        case "yards":
            output.primary = output.yards;
            output.secondary = [output.meters,output.miles,output.km];
            break;
        default:
            output.primary = output.miles;
            output.secondary = [output.km,output.meters,output.yards];
            break;
    }
    return output;
}

router.get('/', (req, res) => {
    History.findAll({
        include: [
            {
                model: Lap
            }
        ]
    })
    .then(histData => {
        if(!histData) {
            res.status(404).json({ message: "There is no historical activity with that id."});
        }
        let historicEvents = histData.map(hData => hData.get({ plain: true }));
        historicEvents = historicEvents.map(hData => {
            hData.act_date = hData.act_date.toString().substring(0,15);
            //Attach proper units
            let units;
            switch(hData.dist_type_id) {
                case 1:
                    units = "km";
                    break;
                case 2:
                    units = "meters";
                    break;
                case 3:
                    units = "yards";
                    break;
                default:
                    units = "miles";
                    break;
            }
            hData.units = units;
            // console.log(hData);
            //Determine what type of activity this was
            let activity_Type;
            switch(hData.type_id) {
                case 1:
                    activity_Type = "Bike Ride";
                    break;
                case 2:
                    activity_Type = "Swim";
                    break;
                case 3:
                    activity_Type = "Walk";
                    break;
                case 4:
                    activity_Type = "Hike";
                    break;
                default:
                    activity_Type = "Run";
                    break;
            }
            hData.activity_Type = activity_Type;
            // console.log(hData);
            return hData;
        });
        const loggedIn = req.session.loggedIn;
        res.render('history-home', { loggedIn, historicEvents });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get("/create", (req, res) => {
    const loggedIn = req.session.loggedIn;
    const user_id = req.session.user_id;
    res.render('history-create', { loggedIn, user_id });
});

router.get("/edit/:id", (req, res) => {
    History.findOne({
        where: { id: req.params.id },
        include: [
            {
                model: Lap
            }
        ]
    })
    .then(retrievedData => {
        if(!retrievedData) {
            res.status(404).json({ message: "There is no historical activity with that id."});
        }
        const plainActivityData = retrievedData.get({ plain: true });
        plainActivityData.act_date = JSON.stringify(plainActivityData.act_date).slice(1,11);
        /*
            Eventually only allow editing for certain usernames
        */
        //Expected to be passed to processActivity
        //{ dist_type_id: formattedData.dist_type_id, distance: formattedData.distance, duration: formattedData.duration }
        const processedActivity = helpers.processActivity({ dist_type_id: plainActivityData.dist_type_id, distance: plainActivityData.distance, duration: plainActivityData.duration });
        
        //Details used to repopulate the form with data already saved
        plainActivityData.fullData = processedActivity;
        plainActivityData.distance = parseFloat(plainActivityData.distance);
        plainActivityData.duration = parseFloat(plainActivityData.duration);
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
        const lapGroups = {};
        for(let i = 0; i < plainActivityData.laps.length; i++) {
            let recorded = lapGroups.hasOwnProperty(`${plainActivityData.laps[i].group_id}`);
            if(!recorded) {
                lapGroups[`${plainActivityData.laps[i].group_id}`] = [plainActivityData.laps[i]];
            } else {
                lapGroups[`${plainActivityData.laps[i].group_id}`].push(plainActivityData.laps[i]);
            }
        }
        plainActivityData.hasLaps = plainActivityData.laps.length > 0;
        const lapArrays = [];
        for(const property in lapGroups) {
            let nextArr = [];
            for(let i = 0; i < lapGroups[property].length; i++) {
                let nextSplit = helpers.processSplit(lapGroups[property][i]);
                nextSplit.primary.splitNo = i;
                nextArr.push(nextSplit);
            }
            lapArrays.push({group: [...nextArr], groupId: lapArrays.length });
        }
        res.render("history-edit", { loggedIn: true, activityInfo: plainActivityData, formData, lapArrays });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
    History.findOne({
        where: { id: req.params.id },
        include: [
            {
                model: Lap
            }
        ]
    })
    .then(retrievedData => {
        if(!retrievedData) {
            res.status(404).json({ message: "There is no historical activity with that id."});
        }
        let formattedData = retrievedData.get({ plain: true });
        //Transfer information from formatted data to displayData in order to add more processed information
        let displayData = { title: formattedData.title, description: formattedData.description, laps: formattedData.laps, act_date: formattedData.act_date, activityStats: processActivity({ dist_type_id: formattedData.dist_type_id, distance: formattedData.distance, duration: formattedData.duration }), duration: formattedData.duration };
        let lapGroups = { };
        for(let i = 0; i < formattedData.laps.length; i++) {
            let recorded = lapGroups.hasOwnProperty(`${formattedData.laps[i].group_id}`);
            if(!recorded) {
                lapGroups[`${formattedData.laps[i].group_id}`] = [formattedData.laps[i]];
            } else {
                lapGroups[`${formattedData.laps[i].group_id}`].push(formattedData.laps[i]);
            }
        }
        displayData.haslaps = formattedData.laps.length > 0;
        let lapArrays = [];
        for(const property in lapGroups) {
            let nextArr = [];
            for(let i = 0; i < lapGroups[property].length; i++) {
                nextArr.push(processSplit(lapGroups[property][i]));
            }
            lapArrays.push({group: [...nextArr]});
        }
        //console.log(JSON.stringify(splitArrays));
        displayData.lapGroups = lapArrays;
        res.render('history-view',{ formattedData: displayData, lapGroups: lapArrays, loggedIn: req.session.loggedIn, user_id: req.session.user_id });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});



module.exports = router;