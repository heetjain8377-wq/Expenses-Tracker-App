const loginBtn = document.getElementById("loginBtn");
const loaderContainer = document.querySelector(".loaderContainer");

loginBtn.addEventListener("click",async () => {

    loaderContainer.style.display = "flex";
    loginBtn.disabled = true;
    loginBtn.style.opacity = "0.7";
    loginBtn.style.cursor = "not-allowed";

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

    loaderContainer.style.display = "none";
    loginBtn.disabled = false;
    loginBtn.style.opacity = "1";
    loginBtn.style.cursor = "pointer";

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