const toggleElements = document.getElementsByClassName("controlled-div");

// console.log(toggleElements);
function toggle(event) {
    const target = event.target;
    // console.log(target);
    if(target.matches('button')) {
        const newTarget = target.parentElement.parentElement.lastElementChild;
        newTarget.classList.toggle('conversions-hidden');
        newTarget.classList.toggle('conversions-displayed');
        target.textContent = target.textContent === "Expand" ? "Collapse" : "Expand";
    }
}

for(let i = 0; i < toggleElements.length; i++) {
    toggleElements[i].addEventListener('click', toggle);
}



// document.getElementsByClassName(".controlled-div").addEventListener('click', toggle);