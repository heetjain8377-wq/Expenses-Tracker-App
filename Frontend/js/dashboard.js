let totalIncome = 0;
let totalExpense = 0;
let categoryData = {};
let transactions = [];

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
};

async function loadDashboard() {
  

    const response = await fetch("https://expenses-tracker-app-ridu.onrender.com/api/transaction/dashboard", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    const data = await response.json();

    totalIncome = data.totalIncome;
    totalExpense = data.totalExpense;

        document.getElementById("totalIncome").innerText = `Total Income : ${totalIncome}`;
    
        document.getElementById("totalExpense").innerText = `Total Expense : ${totalExpense}`;
    
        document.getElementById("balance").innerText = `Balance : ${data.balance}`;

        categoryData = data.categoryTotals;

    renderChart();
    renderDoughnut();
};

loadDashboard();

function renderChart(){
    const ctx = document.getElementById("incomeExpenseChart");

    new Chart(ctx, {
        type : "bar",
        data : {
            labels : ["Income","Expense"],
            datasets : [
                {label : "Amount", 
                data : [totalIncome, totalExpense], 
                backgroundColor : ["#22c55e","#ef4444"],
                borderColor : ["#16a34a", "#dc2626"],
                borderWidth : 2,
                borderRadius : 8
            }]
        },
        options : {
            responsive : true,
            plugins : {
                legend : {display : false}
            },
            scales : {
                y : {beginAtZero : true}
            }
        }
    })
};

function renderDoughnut(){
    const ctx = document.getElementById("categoryChart");

    new Chart(ctx, {
        type : "doughnut",
        data : {
            labels : Object.keys(categoryData),
            datasets : [{
                data : Object.values(categoryData),
                backgroundColor : ["#ef4444","#22c55e","#3b82f6","#eab308","#8b5cf6","#f97316","#ec4899"]
            }]
        },
        options : {
            responsive : true,
            plugins : {
                legend : {position : "bottom"}
            }
        }
    })
};

const addTransactionBtn = document.getElementById("addTransactionBtn");

if(addTransactionBtn){
    addTransactionBtn.addEventListener("click", async () => {
    const type = document.querySelector('input[name="type"]:checked')?.value;
    const category = document.getElementById("category").value;
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const transactionDate = document.getElementById("date").value;

    console.log(amount);
    console.log(typeof amount);

    try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://expenses-tracker-app-ridu.onrender.com/api/transaction/create-transaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                type,
                category,
                amount,
                transactionDate,
                description
            })
        })

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            location.reload();
        } else {
            alert(data.message)
        }
    } catch (error) {
        console.log(error);
    }
});
}

async function getTransactions() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://expenses-tracker-app-ridu.onrender.com/api/transaction/", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })

        const data = await response.json();

        transactions = data.transactions;
        renderTransactions(transactions);

        const table = document.getElementById("transactionTable");
       if(table){
         table.innerHTML = "";
       

        data.transactions.forEach(transaction => {
            table.innerHTML += `
            <tr>
                <td>${transaction.type}</td>
                <td>${transaction.category}</td>
                <td>${transaction.amount}</td>
                <td>${new Date(transaction.transactionDate).toLocaleDateString()}</td>
                <td>${transaction.description}</td>
                <td>
                    <button onclick="editTransaction('${transaction._id}')" class="editBtn">Edit</button>
                    <button onclick="deleteTransaction('${transaction._id}')" class="deleteBtn">Delete</button>
                </td>
            <tr>
            `
        })
    }
    } catch (error) {
        console.log(error);
    }
};

getTransactions();

async function deleteTransaction(id) {

    const result = confirm("Are you sure you want to delete this transaction?");

    if(!result){
        return;
    }

    try {
        const token = localStorage.getItem("token");
        // const id = localStorage.getItem("editId");

        const response = await fetch(`https://expenses-tracker-app-ridu.onrender.com/api/transaction/delete-transaction/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })

        const data = await response.json();
        alert(data.message);
        getTransactions();
        loadDashboard();
        location.reload();
    } catch (error) {
        console.log(error);
    }
};

function editTransaction(id){
    localStorage.setItem("editId", id);
    window.location.href = "edit.html";
};

const updateTransactionBtn = document.getElementById("updateTransactionBtn");

if(updateTransactionBtn){
    updateTransactionBtn.addEventListener("click", async() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("editId");

    const type = document.querySelector('input[name="type"]:checked')?.value;
    const category = document.getElementById("category").value;
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const transactionDate = document.getElementById("date").value;

    try{
        const response = await fetch(`https://expenses-tracker-app-ridu.onrender.com/api/transaction/update-transaction/${id}`,{
            method : "PUT",
            headers : {
                "Content-Type":"application/json",
                Authorization : `Bearer ${token}`
            },
            body : JSON.stringify({
                type,
                category,
                amount,
                description,
                transactionDate
            })
        });

        const data = await response.json();

        if(response.ok){
            alert(data.message);
            localStorage.removeItem("editId");
            setTimeout(() => {
                window.location.href = "dashboard.html"
            },1500);
            loadDashboard();
        }
    }catch(error){
        console.log(error);
    }
});
};

const modal = document.getElementById("transactionModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");

openBtn.onclick = () => {
    modal.style.display = "flex";
};

closeBtn.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (e) => {
    if(e.target === modal){
        modal.style.display = "none";
    };
};

function renderTransactions(data){
    const table = document.getElementById("transactionTable");
    table.innerHTML = "";

     data.forEach(transaction => {
            table.innerHTML += `
            <tr>
                <td>${transaction.type}</td>
                <td>${transaction.category}</td>
                <td>${transaction.amount}</td>
                <td>${new Date(transaction.transactionDate).toLocaleDateString("en-DB")}</td>
                <td>${transaction.description}</td>
                <td>
                    <button onclick="editTransaction('${transaction._id}')" class="editBtn">Edit</button>
                    <button onclick="deleteTransaction('${transaction._id}')" class="deleteBtn">Delete</button>
                </td>
            <tr>
            `
        });
};

const search = document.getElementById("search");
const filter = document.getElementById("filter");

search.addEventListener("input", () => {
    const keyword = search.value.toLowerCase();
    const filtered = transactions.filter(t => 
        t.category.toLowerCase().includes(keyword) || t.description.toLowerCase().includes(keyword) || t.type.toLowerCase().includes(keyword));

    renderTransactions(filtered);
});

filter.addEventListener("change", () => {
    const selected = filter.value;

    if(selected === "all"){
        renderTransactions(transactions);
        return;
    };

    const filtered = transactions.filter(t => t.type.toLowerCase() === selected);

    renderTransactions(filtered);
});