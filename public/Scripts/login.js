document.querySelector("#logindata").addEventListener("click", async() => {
    let username = document.getElementById("usernamel").value;
    let password = document.getElementById("passwordl").value;
    if (username == "" || password == "") {
        alert("Username and Password cannot be empty");
    }
    else {
        console.log("Authenticating")
        let response=await fetch("/login",{
            method:"POST",
            headers:{   
                "Content-Type":"application/json"
            },  
            body:JSON.stringify({
                username:username,
                password:password
            })
        })
        let data=await response.json();
        if(response.status===200){
            localStorage.setItem("token",data.token);
            
            console.log("Authenticated successfully + "+data.token);
            alert("Logged In Successfully");
            window.location.href = "/te";
        }
        else{
            alert("Bad Authentication Check username and password \nIf you dont have account please sign up")
        }
    }
});
homee1.addEventListener("click", async () => {
    window.location.href = "/";
        // const res=await fetch("/protected",{
        //     method:"GET",
        //     headers:{   
        //         "authorization":`Bearer ${localStorage.getItem('token')}`
        //     }
        // });                         
        // const data1=await res.json();
        // if(res.status===200){
        //     alert(data1.data);
        //     alert("User Authenticated");
        //     window.location.href = "/";
        // }
});