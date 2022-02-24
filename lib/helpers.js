const { getMiles, getKilometers, getYards, getMeters, formatTime } = require('./model-objects');

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
    formatTime
}