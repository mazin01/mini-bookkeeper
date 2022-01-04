const balance = document.getElementById('balance');
const moneyBlus = document.getElementById('money-blus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const tranTitle = document.getElementById('tran-title');
const tranAmount = document.getElementById('tran-amount');

document.getElementById('theme-btn').addEventListener('change', function(event){
    (event.target.checked) ? document.body.setAttribute('data-theme', 'dark') : document.body.removeAttribute('data-theme');
  });

document.getElementById('theme-btn').onclick = function() {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "light";
    
    this.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="moon" class="svg-inline--fa fa-moon fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"></path></svg>'


    if (currentTheme === "light") {
        targetTheme = "dark";
        
        this.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sun" class="svg-inline--fa fa-sun fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"></path></svg>'
    }

    document.documentElement.setAttribute('data-theme', targetTheme)
};

const localStoragTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStoragTransactions : [] ;

function addTransaction(e) {
    e.preventDefault()
    
    if (tranTitle.value.trim() === '' || tranAmount.value.trim() === '') {
        alert('Please add the transaction details!!');
    } else {
        const transaction = {
            id: generatID(),
            title: tranTitle.value,
            amount: +tranAmount.value
        };
        
        transactions.push(transaction);
        
        addTransactionDOM(transaction);
        
        updateValues();

        updateLocalStorage();

        tranTitle.value = '';
        tranAmount.value = '';

    };
}

// generat random ID
function generatID() {
    return Math.floor(Math.random() * 100000000)
}

// Add transaction to list in the DOM
function addTransactionDOM(transaction) {
    // Get the sign of the transaction amount
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    // Add class name based on the transaction amount
    item.classList.add(transaction.amount < 0 ? 'minus' : 'blus');

    item.innerHTML = `
    ${transaction.title} <span>${sign}${Math.abs(transaction.amount)}</span> 
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>`;

    list.appendChild(item);
}
console.log(transactions)
// Update te values of balanse, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0 ).toFixed(2);

    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);

    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `$${total}`;
    moneyBlus.innerText = `$${income}`;
    moneyMinus.innerText = `$${expense}`;
};

function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage()

    init()
};

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions))
};

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
};

init();

form.addEventListener('submit', addTransaction);