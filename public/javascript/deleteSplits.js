
async function deleteSplits(event) {
    event.preventDefault();
    const activity_id = parseInt(window.location.toString().split('/')[window.location.toString().split('/').length - 1]);
    const response = await fetch(`/api/splits/${activity_id}`, {
        method: "DELETE"
    });

    if(response.ok) {
        window.location.reload();
    } else {
        alert(`An error occurred: ${response.statusText} - ${response.status}`);
    }
}

document.querySelector("#delete-splits").addEventListener("submit", deleteSplits);