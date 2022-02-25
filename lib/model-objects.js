//Create functions that facilitate data manipulation
const MILEm = 1609.344; //Meters in a mile
const YARDm = 100/(36*2.54); //Yards in a meter

//Conversion functions

//code 0 = miles, code 1 = km, code 2 = meters, code 3 = yards
//Convert to Meters
function getMeters(inputVal, inputCode) {
    switch(inputCode) {
        case 0:
            return inputVal*MILEm;
        case 1:
            return inputVal*1000;
        case 3:
            return inputVal/YARDm;
    }
    return inputVal;
}

//code 0 = miles, code 1 = km, code 2 = meters, code 3 = yards
function getYards(inputVal, inputCode) {
    switch(inputCode) {
        case 0:
            return inputVal*1760;
        case 1:
            return inputVal*1000*YARDm;
        case 2:
            return inputVal*YARDm;
    }
    return inputVal;
}

//code 0 = miles, code 1 = km, code 2 = meters, code 3 = yards
function getMiles(inputVal, inputCode) {
    switch(inputCode) {
        case 1:
            return inputVal/(MILEm/1000);
        case 2:
            return inputVal/MILEm;
        case 3:
            return inputVal/1760;
    }
    return inputVal;
}

//code 0 = miles, code 1 = km, code 2 = meters, code 3 = yards
function getKilometers(inputVal, inputCode) {
    switch(inputCode) {
        case 0:
            return inputVal*(MILEm/1000);
        case 2:
            return inputVal/1000;
        case 3:
            return inputVal/(YARDm*1000);
    }
    return inputVal;
}

//format an input time
function formatTime(inputTime) {
    //Round the value to third decimal place first to allow for possibility of rounding to the next second/minute
    let remain = Math.round(inputTime*1000)/1000;
    let output = "";
    //Hours
    if(remain >= 3600) {
        //At least an hour remains
        output += Math.floor(remain/3600) + ":";
        remain -= Math.floor(remain/3600)*3600;
    }
    //Minutes
    if(remain >= 600) {
        //At least 10 minutes remain
        output += Math.floor(remain/60) + ":";
        remain -= Math.floor(remain/60)*60;
    } else {
        if(output !== "") {
            //Wasn't an empty string
            output += `0${Math.floor(remain/60)}:`;
            remain -= Math.floor(remain/60)*60;
        } else {
            //Was an empty string
            if(remain >= 60) {
                //More than a minute left
                output += `${Math.floor(remain/60)}:`;
                remain -= Math.floor(remain/60)*60;
            }
        }
    }
    //Seconds
    if(remain >= 10) {
        //At least 10 seconds remain
        output += Math.floor(remain);
        remain -= Math.floor(remain);
    } else {
        if(output !== "") {
            //Wasn't an empty string
            output += `0${Math.floor(remain)}`;
            remain -= Math.floor(remain);
        } else {
            //Was an empty string
            output += Math.floor(remain);
            remain -= Math.floor(remain);
        }
    }
    //Fraction of seconds
    if(remain > 0) {
        // console.log(String(remain));
        if(String(remain).length > 4) {
            let lastInts = Math.round(remain*1000);
            if(lastInts < 100) {
                output += `.0`;
                if(lastInts%10 === 0) {
                    output += `${lastInts/10}`;
                } else {
                    if(lastInts < 10) {
                        output += `0${lastInts}`;
                    } else {
                        output += `${lastInts}`;
                    }
                }
            } else {
                if(lastInts%10 === 0) {
                    output += `.${lastInts/10}`;
                } else {
                    output += `.${lastInts}`;
                }
            }
            //output += String(remain).substring(1,remain.toFixed(3).length);
        } else {
            output += String(remain).substring(1);
        }
        
    }
    return output;
}

//Function that takes in an activity's raw data and process it

module.exports = { getMeters, getKilometers, getMiles, getYards, formatTime };