//Array that will hold the data for created splits
let splitData = [];
let splitStrings = [];
const activity_id = parseInt(window.location.toString().split('/')[window.location.toString().split('/').length - 1]);
console.log(activity_id);
const splitDiv = document.querySelector("#splitsRegistered");

const numberToString = inputNumbers => {
    let output = `${inputNumbers[0]}:`;
    if(inputNumbers[1] < 10) {
        output += "0";
    }
    output += `${inputNumbers[1]}:`;
    if(inputNumbers[2] < 10) {
        output += "0";
    }
    output += inputNumbers[2];
    return output;
}
const addSplit = (event) => {
    event.preventDefault();
    const distance = parseFloat(document.querySelector("#split-distance").value.trim());
    if(!distance) {
        return;
    }
    const hours = parseInt(document.querySelector("#split-hours").value.trim()) || 0;
    const minutes = parseInt(document.querySelector("#split-minutes").value.trim()) || 0;
    const seconds = parseFloat(document.querySelector("#split-seconds").value.trim()) || 0;
    if(!hours && !minutes && !seconds) {
        return;
    }
    const duration = hours*3600 + minutes*60 + seconds;
    const dist_type_id = document.querySelector("#split_dist_type_id").value;
    const type_id = document.querySelector("#split_type_id").value;
    const effort_type_id = document.querySelector("#split_effort_type_id").value;
    if(duration === 0 || distance === 0) {
        return;
    }
    let unitStr;
    switch(dist_type_id) {
        case 1:
            unitStr = "kilometers";
            break;
        case 2:
            unitStr = "meters";
            break;
        case 3:
            unitStr = "yards";
            break;
        default:
            unitStr = "miles";
            break;
    }
    let activityTypeStr;
    switch(type_id) {
        case 1:
            activityTypeStr = "Bike Ride";
            break;
        case 2:
            activityTypeStr = "Swim";
            break;
        case 3:
            activityTypeStr = "Walk";
            break;
        case 4:
            activityTypeStr = "Hike";
            break;
        default:
            activityTypeStr = "Run";
            break;
    }
    let effort_type;
    switch(effort_type_id) {
        case 1:
            effort_type = "Hard";
            break;
        case 2:
            effort_type = "Race";
            break;
        default:
            effort_type = "Easy";
            break;
    }
    const timeStr = numberToString([hours,minutes,seconds]);
    const splitObject = { activity_id, duration, dist_type_id, distance };
    splitData.push(splitObject);
    const registerStr = `${distance} ${unitStr} - ${timeStr}`;
    splitStrings.push(registerStr);
    document.querySelector("#splitsRegistered").innerHTML = "";
    const newList = document.createElement("ol");
    for(let i = 0; i < splitStrings.length; i++) {
        const nextLi = document.createElement("li");
        nextLi.className = "margin-bottom-tiny margin-left-small";
        nextLi.textContent = splitStrings[i];
        newList.appendChild(nextLi);
    }
    document.querySelector("#splitsRegistered").append(newList);
}

document.querySelector("#registerSplit").addEventListener("submit", addSplit);

const clearLast = () => {
    splitData.pop();
    splitStrings.pop();
    document.querySelector("#splitsRegistered").innerHTML = "";
    const newList = document.createElement("ol");
    for(let i = 0; i < splitStrings.length; i++) {
        const nextLi = document.createElement("li");
        nextLi.textContent = splitStrings[i];
        newList.appendChild(nextLi);
    }
    document.querySelector("#splitsRegistered").append(newList);
}

document.querySelector("#clear-last").addEventListener("click", clearLast);

const clearAll = () => {
    splitData = [];
    splitStrings = [];
    document.querySelector("#splitsRegistered").innerHTML = "";
}

document.querySelector("#clear-all").addEventListener("click", clearAll);

async function updateSplitInfo(event) {
    event.preventDefault();
    const activity_id = parseInt(window.location.toString().split('/')[window.location.toString().split('/').length - 1]);
    //Need to run two database queries - first, destroy the existing splits, and then create the new splits
    //Only allow changes if there is actually split data in the array
    if(splitData.length > 0) {
        const response1 = await fetch(`/api/splits/${activity_id}`, {
            method: "DELETE"
        });
        if(response1.ok) {
            //Now save the new splits
            //Add activity_id and group_id to splits to reflect database model
            splitData = splitData.map(split => {
                split.activity_id = activity_id;
                split.group_id = 0;
                return split;
            });
            const response2 = await fetch(`/api/splits`, {
                method: "POST",
                body: JSON.stringify({ splits: splitData }),
                headers: { "Content-Type": "application/json" }
            });

            if(response2.ok) {
                window.location.reload();
            } else {
                alert(`Split save failed: ${response2.statusText} - ${response2.status}`);
            }
        } else {
            alert(`Split deletion failed: ${response1.statusText} - ${response1.status}`);
        }
    }
}

document.querySelector("#splits-submit").addEventListener("submit", updateSplitInfo);