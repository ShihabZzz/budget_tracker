let idx = 0;
let amountContainer = [];

let income = 0;
let expense = 0;


let saveAll_db = (income, expense, amountContainer) => {
    localStorage.setItem("income_db", income);
    localStorage.setItem("expense_db", expense);
    localStorage.setItem("amounts_db", JSON.stringify(amountContainer));
}

let updateIncomeUI = () => {
    let incomeValue = `Income: ${income}`;
    document.getElementById("incomeData").innerText = incomeValue;
}

let updateExpenseUI = () => {
    let expenseValue = `Expense: ${expense}`;
    document.getElementById("expenseData").innerText = expenseValue;
}

let detailsUI = () => {
    let details = document.getElementById("detailsData");

    // Empty-out at every request
    details.innerHTML = "";

    for (let index = 0; index < amountContainer.length; index++) {
        const amount = amountContainer[index].amountData;
        const type = amountContainer[index].amountType;

        let div = document.createElement('div');
        div.classList.add("px-6", "pt-6", "flex", "justify-between", "bg-gray-200")

        div.innerHTML = `
        <div class="flex space-x-2 items-center">
            <p class="font-medium text-xl">${amount}</p>
            <p class="font-normal text-sm">${type}</p>
        </div>
        <div class="flex space-x-4">
            <a href="#" onClick="deleteItem(${index})">Delete</a>
            <a href="#" onClick="editItem(${index})">Edit</a>
        </div>
   `;
        details.appendChild(div);
    }
}

function deleteItem(index) {
    let spliceAmount = amountContainer[index].amountData;
    let spliceType = amountContainer[index].amountType;
    amountContainer.splice(index, 1);
    (spliceType === "income" ? income -= spliceAmount : expense -= Math.abs(spliceAmount));

    saveAll_db(income, expense, amountContainer);

    updateIncomeUI();
    updateExpenseUI();
    detailsUI();
}

function editItem(index) {
    let itemAmount = prompt("Please Insert Updated Value", amountContainer[index].amountData);

    if (itemAmount !== null && !isNaN(itemAmount)) {
        itemAmount = Number(itemAmount);
        let itemType = itemAmount > 0 ? "income" : itemAmount < 0 ? "expense" : "zero";
        if (itemType === "zero") {
            alert("Zero is not acceptable!");
        } else {
            (amountContainer[index].amountType === "income" ? income -= amountContainer[index].amountData : expense -= Math.abs(amountContainer[index].amountData));
            (itemAmount > 0 ? income += itemAmount : expense += Math.abs(itemAmount));
            amountContainer[index].amountData = itemAmount;
            amountContainer[index].amountType = itemType;

            saveAll_db(income, expense, amountContainer);

            updateIncomeUI();
            updateExpenseUI();
            detailsUI();
        }
    } else {
        alert("Insert Proper Numerical Value!");
    }
}

// check previous data
let preData = localStorage.getItem("amounts_db");

if (preData) {
    amountContainer = JSON.parse(preData); // parse JSON format => array of object
    if (amountContainer.length > 0) {
        idx = amountContainer[amountContainer.length - 1].idx + 1 // set proper idx;
        income = Number(localStorage.getItem("income_db"));
        expense = Number(localStorage.getItem("expense_db"));
    }
} else {
    saveAll_db(income, expense, amountContainer);
}

// initial calling
updateIncomeUI();
updateExpenseUI();
detailsUI();

let okClick = document.getElementById('ok');

// click action
okClick.addEventListener('click', () => {
    let amountData = Number(document.getElementById('amount').value);
    let amountType = amountData > 0 ? "income" : amountData < 0 ? "expense" : "zero";
    if (amountType === "zero") {
        alert("Zero or Blank is not acceptable!");
    } else {
        (amountData > 0 ? income += amountData : expense += Math.abs(amountData));
        let parsingContainer = {
            "idx": idx++,
            "amountData": amountData,
            "amountType": amountType,
        };
        amountContainer.push(parsingContainer);

        saveAll_db(income, expense, amountContainer);

        // update UI
        updateIncomeUI();
        updateExpenseUI();
        detailsUI();
    }

});
