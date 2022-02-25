//Sign the user up
async function signUp(event) {
    //Will hold the response message if something goes wrong with the sign up
    let message = "";
    event.preventDefault();
    const username = document.querySelector("#signup-username").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#signup-password1").value.trim();
    const password2 = document.querySelector("#signup-password2").value.trim();
    if(!email.match(/[a-zA-Z0-9]+\.?[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/)) {
        message = "Invalid email address.";
        document.querySelector("#signup-fail").textContent = message;
        //Clear the message after three seconds
        setTimeout(() => {
            document.querySelector("#signup-fail").textContent = "";
        }, 3000);
        return;
    } else if(password !== password2) {
        message = "Passwords do no match.";
        document.querySelector("#signup-fail").textContent = message;
        //Clear the message after three seconds
        setTimeout(() => {
            document.querySelector("#signup-fail").textContent = "";
        }, 3000);
        return;
    }
    if(username && password) {
        const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { "Content-Type": "application/json" }
        });

        if(response.ok) {
            document.location.replace("/dashboard");
        } else {
            console.log(response.status);
            message = "Sign up failed";
            document.querySelector("#signup-fail").textContent = message;
            //Clear the message after three seconds
            setTimeout(() => {
                document.querySelector("#signup-fail").textContent = "";
            }, 3000);
            return;
        }
    }
}

document.querySelector("#signup-form").addEventListener("submit", signUp);

//Log the user in
async function login(event) {
    event.preventDefault();
    let message = "";
    const username = document.querySelector("#login-username").value.trim();
    const password = document.querySelector("#login-password").value.trim();

    if(username && password) {
        const response = await fetch("/api/users/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            }),
            headers: { "Content-Type": "application/json" }
        });
        
        if(response.ok) {
            document.location.replace("/dashboard");
        } else {
            message = "Invalid login credentials.";
            document.querySelector("#login-fail").textContent = message;
            //Clear the message after three seconds
            setTimeout(() => {
                document.querySelector("#login-fail").textContent = "";
            }, 3000);
            return;
        }
    } else {
        message = "<span>Username/email and</span><br /><span>password required.</span>";
        document.querySelector("#login-fail").innerHTML = message;
        //Clear the message after three seconds
        setTimeout(() => {
            document.querySelector("#login-fail").innerHTML = "";
        }, 3000);
        return;
    }
}

document.querySelector("#login-form").addEventListener("submit", login);