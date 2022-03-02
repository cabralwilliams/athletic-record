
async function startFollowing(event) {
    event.preventDefault();
    const followee_id = parseInt(window.location.toString().split("/")[window.location.toString().split("/").length - 1]);
    const follower_id = parseInt(document.querySelector("#follower_id").value);

    const response = await fetch("/api/followers", {
        method: "POST",
        body: JSON.stringify({
            followee_id,
            follower_id
        }),
        headers: { "Content-Type": "application/json" }
    });

    if(response.ok) {
        window.location.reload();
    } else {
        alert(`An error occurred when performing the action - ${response.status} - ${response.statusText}`);
    }
}

document.querySelector("#startFollowingForm").addEventListener("submit", startFollowing);