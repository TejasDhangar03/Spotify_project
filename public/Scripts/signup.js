document.getElementById("signupdata").addEventListener("click", async () => {
    if (document.getElementById("password").value != document.getElementById("cpassword").value) {

        alert("Passwords do not match");
        return;
    }
    else {

        if (document.getElementById("username").value == "" || document.getElementById("password").value == "" || document.getElementById("cpassword").value == "") {
            alert("Username and Password cannot be empty");
        }
        else {
            // if (confirm("Are you sure you want to sign up?")) {
            // localStorage.setItem(document.getElementById("username").value, document.getElementById("password").value);   
            let response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: document.getElementById("username").value,
                    password: document.getElementById("password").value
                })
            })

            let data = await response.json();

            if (response.status === 201) {
                alert("Signed Up Successfully");
                window.location.href = "/login";
            } 
            else 
            {
                alert(data.message);
            }
        }
        // console.log();
        // alert("Signed Up Successfully");
        // window.location.href = "login.html";
    }
});

homee.addEventListener("click", () => {
    window.location.href = "/";
});
