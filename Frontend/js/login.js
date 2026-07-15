const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click",async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("https://expenses-tracker-app-ridu.onrender.com/api/auth/login",{
        method : "POST",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    localStorage.setItem("token", data.token);

    if(response.ok){
        alert(data.message);
    }else{
        alert(data.message)
    }

    if(response.ok){
        setTimeout(() => {
         window.location.href = "dashboard.html";
        },2000);
    }
});