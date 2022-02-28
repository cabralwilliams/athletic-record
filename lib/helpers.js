const { getMiles, getKilometers, getYards, getMeters, formatTime, separateTime } = require('./model-objects');

module.exports = {
    formatDate: inputStr => {
        let strArr = inputStr.toString().split(" ");
        let output = "";
        let month;
        switch(strArr[1]) {
            case "Jan":
                month = "January";
                break;
            case "Feb":
                month = "February";
                break;
            case "Mar":
                month = "March";
                break;
            case "Apr":
                month = "April";
                break;
            case "May":
                month = "May";
                break;
            case "Jun":
                month = "June";
                break;
            case "Jul":
                month = "July";
                break;
            case "Aug":
                month = "August";
                break;
            case "Sep":
                month = "September";
                break;
            case "Oct":
                month = "October";
                break;
            case "Nov":
                month = "November";
                break;
            case "Dec":
                month = "December";
                break;
            default:
                month = strArr[1];
                break;
        }
        output += `${month} ${strArr[2]}, ${strArr[3]}`;
        return output;
    },

    getKilometers,
    getMeters,
    getMiles,
    getYards,
    formatTime,
    processActivity: activityInfo => {
        let distInt = parseInt(activityInfo.dist_type_id);
        let output = { primary: null, secondary: null, tertiary: null, quaternary: null };
        let aTime = parseFloat(activityInfo.duration);
        let dMi, dKm, dMe, dYd, pMi, pKm, pMe, pYd;
        let primary, secondary, tertiary, quaternary;
        switch(distInt) {
            case 1:
                //Kilometers
                dKm = parseFloat(activityInfo.distance);
                dMi = getMiles(dKm,distInt);
                dMe = getMeters(dKm,distInt);
                dYd = getYards(dKm,distInt);
                break;
            case 2:
                //Meters
                dMe = parseFloat(activityInfo.distance);
                dMi = getMiles(dMe,distInt);
                dKm = getKilometers(dMe,distInt);
                dYd = getYards(dMe,distInt);
                break;
            case 3:
                //Yards
                dYd = parseFloat(activityInfo.distance);
                dMi = getMiles(dYd,distInt);
                dKm = getKilometers(dYd,distInt);
                dMe = getMeters(dYd,distInt);
                break;
            default:
                //Miles
                dMi = parseFloat(activityInfo.distance);
                dMe = getMeters(dMi,distInt);
                dKm = getKilometers(dMi,distInt);
                dYd = getYards(dMi,distInt);
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
    },
    processSplit: splitInfo => {
        let distInt = parseInt(splitInfo.dist_type_id);
        let output = { miles: null, km: null, yards: null, meters: null, primary: null };
        let dMi, dKm, dMe, dYd, tMi, tKm, tMe, tYd;
        let primary;
        switch(distInt) {
            case 1:
                //Given in kilometers
                dKm = parseFloat(splitInfo.distance);
                dMi = getMiles(dKm,distInt);
                dMe = getMeters(dKm,distInt);
                dYd = getYards(dKm,distInt);
                tKm = parseFloat(splitInfo.duration)/dKm;
                tMi = tKm/dMi*dKm;
                tMe = tKm/dMe*dKm;
                tYd = tKm/dYd*dKm;
                primary = "km";
                break;
            case 2:
                //Given in meters
                dMe = parseFloat(splitInfo.distance);
                dMi = getMiles(dMe,distInt);
                dKm = getKilometers(dMe,distInt);
                dYd = getYards(dMe,distInt);
                tMe = parseFloat(splitInfo.duration)/dMe;
                tMi = tMe/dMi*dMe;
                tKm = tMe/dKm*dMe;
                tYd = tMe/dYd*dMe;
                primary = "meters";
                break;
            case 3:
                //Given in yards
                dYd = parseFloat(splitInfo.distance);
                dMi = getMiles(dYd,distInt);
                dKm = getKilometers(dYd,distInt);
                dMe = getMeters(dYd,distInt);
                tYd = parseFloat(splitInfo.duration)/dYd;
                tMi = tYd/dMi*dYd;
                tKm = tYd/dKm*dYd;
                tMe = tYd/dMe*dYd;
                primary = "yards";
                break;
            default:
                //Given in miles
                dMi = parseFloat(splitInfo.distance);
                dYd = getYards(dMi,distInt);
                dKm = getKilometers(dMi,distInt);
                dMe = getMeters(dMi,distInt);
                tMi = parseFloat(splitInfo.duration)/dMi;
                tYd = tMi/dYd*dMi;
                tKm = tMi/dKm*dMi;
                tMe = tMi/dMe*dMi;
                primary = "miles";
                break;
        }
        output.miles = { distance: dMi.toFixed(3), time: formatTime(tMi), pace: tMi.toFixed(3), data: [dMi,tMi,tMi], unit1: "miles", unit2: "minutes/mile", formatTheTime: true };
        output.km = { distance: dKm.toFixed(3), time: formatTime(tKm), pace: tKm.toFixed(3), data: [dKm,tKm,tKm], unit1: "kilometers", unit2: "minutes/km", formatTheTime: true };
        output.meters = { distance: dMe.toFixed(1), time: formatTime(tMe), pace: (1/tMe).toFixed(3), data: [dMe,tMe,1/tMe], unit1: "meters", unit2: "meters/second", formatTheTime: false };
        output.yards = { distance: dYd.toFixed(1), time: formatTime(tYd), pace: (1/tYd).toFixed(3), data: [dYd,tYd,1/tYd], unit1: "yards", unit2: "yards/second", formatTheTime: false };
        const dType = { isMiles: false, isKm: false, isMeters: false, isYards: false };
        switch(primary) {
            case "km":
                output.primary = output.km;
                dType.isKm = true;
                output.secondary = [output.miles,output.meters,output.yards];
                break;
            case "meters":
                output.primary = output.meters;
                dType.isMeters = true;
                output.secondary = [output.yards,output.km,output.miles];
                break;
            case "yards":
                output.primary = output.yards;
                dType.isYards = true;
                output.secondary = [output.meters,output.miles,output.km];
                break;
            default:
                output.primary = output.miles;
                dType.isMiles = true;
                output.secondary = [output.km,output.meters,output.yards];
                break;
        }
        output.primary.dType = dType;
        const timeVals = separateTime(splitInfo.duration);
        output.primary.hours = timeVals[0];
        output.primary.minutes = timeVals[1];
        output.primary.seconds = timeVals[2];
        output.primary.distNumeric = parseFloat(output.primary.distance);
        return output;
    },
    stringifyData: inputData => {
        return JSON.stringify(inputData);
    },
    separateTime,
    truncateNumber: inputNumber => {
        let fixedDigits;
        const splitStr = `${inputNumber}`.split(".");
        if(splitStr.length === 1) {
            fixedDigits = 0;
        } else {
            if(splitStr[1].length < 3) {
                fixedDigits = splitStr[1].length;
            } else {
                fixedDigits = 3;
            }
        }
        return inputNumber.toFixed(fixedDigits);
    }
}