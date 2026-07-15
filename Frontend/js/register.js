const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click",async () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    const response = await fetch("http://localhost:5000/api/auth/register",{
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

    if(data.ok){
        alert(data.message);
        setTimeout(() => {
         window.location.href = "login.html";
        },2000);
    }else{
        alert(data.message)
    }
});