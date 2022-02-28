//Import modules
const router = require('express').Router();
const { User, Activity, Split, Comment } = require('../../models');
const helpers = require('../../lib/helpers');
//Format stats for a particular activity
//code 0 = miles, code 1 = km, code 2 = meters, code 3 = yards
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

router.get('/:id', (req, res) => {
    Activity.findOne({
        where: { id: req.params.id },
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Split,
                attributes: ['distance','duration','dist_type_id','group_id']
            },
            {
                model: Comment,
                attributes: ['comment_text'],
                include: [
                    {
                        model: User,
                        attributes: ['username']
                    }
                ]
            }
        ]
    })
    .then(activityData => {
        let formattedData = activityData.get({ plain: true });
        //Transfer information from formatted data to displayData in order to add more processed information
        let displayData = { title: formattedData.title, description: formattedData.description, username: formattedData.user.username, splits: formattedData.splits, act_date: formattedData.act_date, activityStats: processActivity({ dist_type_id: formattedData.dist_type_id, distance: formattedData.distance, duration: formattedData.duration }), duration: formattedData.duration, comments: formattedData.comments  };
        let actionStr = `${displayData.username} `;
        switch(formattedData.type_id) {
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
        actionStr += ` ${displayData.activityStats.primary.distance} ${displayData.activityStats.primary.unit1}`; 
        let splitGroups = { };
        for(let i = 0; i < formattedData.splits.length; i++) {
            let recorded = splitGroups.hasOwnProperty(`${formattedData.splits[i].group_id}`);
            if(!recorded) {
                splitGroups[`${formattedData.splits[i].group_id}`] = [formattedData.splits[i]];
            } else {
                splitGroups[`${formattedData.splits[i].group_id}`].push(formattedData.splits[i]);
            }
        }
        displayData.hasSplits = formattedData.splits.length > 0;
        let splitArrays = [];
        for(const property in splitGroups) {
            let nextArr = [];
            for(let i = 0; i < splitGroups[property].length; i++) {
                nextArr.push(processSplit(splitGroups[property][i]));
            }
            splitArrays.push({group: [...nextArr]});
        }
        //console.log(JSON.stringify(splitArrays));
        displayData.splitGroups = splitArrays;
        //console.log(displayData.splitGroups);
        // res.json(formattedData);
        // res.json(activityData);
        //code 0 = miles, code 1 = km, code 2 = meters, code 3 = yards
        res.render('activity-view',{ formattedData: displayData, splitGroups: splitArrays, actionStr, loggedIn: req.session.loggedIn, user_id: req.session.user_id });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;