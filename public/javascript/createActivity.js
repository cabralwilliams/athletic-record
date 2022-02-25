
async function createActivity(event) {
    event.preventDefault();

    //Get the data from all of the inputs
    const title = document.querySelector("#title").value.trim();
    const description = document.querySelector("#description").value.trim();
    const act_date = document.querySelector("#act_date").value.trim();
    const distance = parseFloat(document.querySelector("#distance").value.trim());
    const hours = parseInt(document.querySelector("#hours").value.trim());
    const minutes = parseInt(document.querySelector("#minutes").value.trim());
    const seconds = parseFloat(document.querySelector("#seconds").value.trim());
    const type_id = parseInt(document.querySelector("#type_id").value);
    const dist_type_id = parseInt(document.querySelector("#dist_type_id").value);
    const effort_type_id = parseInt(document.querySelector("#effort_type_id").value);
    const user_id = parseInt(document.querySelector("#user_id").value);
    const duration = 3600*hours + 60*minutes + seconds;

    if(title && description && act_date && distance) {
        const response = await fetch("/api/activities", {
            method: "POST",
            body: JSON.stringify({
                title,
                description,
                act_date,
                distance,
                duration,
                type_id,
                dist_type_id,
                effort_type_id,
                user_id
            }),
            headers: { "Content-Type": "application/json" }
        });

        if(response.ok) {
            window.location.replace("/dashboard");
        } else {
            alert(response.status);
        }
    }
}

document.querySelector("#create-form").addEventListener("submit", createActivity);