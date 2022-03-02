
async function addComment(event) {
    event.preventDefault();
    const activity_id = parseInt(window.location.toString().split("/")[window.location.toString().split("/").length - 1]);
    const user_id = parseInt(document.querySelector("#user_id").value);
    const comment_text = document.querySelector("#comment_text").value.trim();

    if(!comment_text) {
        return;
    }
    const response = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({ activity_id, user_id, comment_text }),
        headers: { "Content-Type": "application/json"}
    });

    if(response.ok) {
        window.location.reload();
    } else {
        alert(`Comment could not be added - ${response.status} - ${response.statusText}`);
    }
}

document.querySelector("#comment-form").addEventListener("submit", addComment);