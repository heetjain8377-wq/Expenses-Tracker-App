const registerBtn = document.getElementById("registerBtn");
const loaderContainer = document.querySelector(".loaderContainer");

registerBtn.addEventListener("click",async () => {

    loaderContainer.style.display = "flex";
    registerBtn.disabled = true;
    registerBtn.style.opacity = "0.7";
    registerBtn.style.cursor = "not-allowed";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    const response = await fetch("https://expenses-tracker-app-ridu.onrender.com/api/auth/register",{
        method : "POST",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify({
            name,
            email,
            password,
            phoneNumber
        })
    });

    const data = await response.json();

    loaderContainer.style.display = "none";
    registerBtn.disabled = false;
    registerBtn.style.opacity = "1";
    registerBtn.style.cursor = "pointer";

    if(data.ok){
        alert(data.message);
        setTimeout(() => {
         window.location.href = "login.html";
        },2000);
    }else{
        alert(data.message)
    }
});