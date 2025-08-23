const dateElement = document.getElementById('date');
const addExpenseBtn = document.getElementById('add-expense');
const expenseTypeInput = document.getElementById('expense-type');
const expenseAmountInput = document.getElementById('expense-amount');
const resetBtn = document.getElementById('reset-btn');

const today = new Date();
dateElement.textContent = today.toDateString();

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
trackExpense();

addExpenseBtn.addEventListener('click', () =>{
    const purchaseType = expenseTypeInput.value;
    const amount = parseFloat(expenseAmountInput.value);
    if(amount < 0 || isNaN(amount) || purchaseType.trim() === '') {
        showAlert('Please enter a valid expense type');
        return;
    }
    expenses.push({ type: purchaseType, amount: amount });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    expenseTypeInput.value = '';
    expenseAmountInput.value = '';
    showSuccess('Expense added successfully!');
    trackExpense();
    resetBtn.style.display = 'block';
});

function trackExpense(){
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    let total = 0;
    expenses.forEach((expenses) =>{
        const li = document.createElement('li');
        li.textContent = `${expenses.type}: $${expenses.amount.toFixed(2)}`;
        li.classList.add('expense-item');
        expenseList.appendChild(li);
        total += expenses.amount;
    });
    
}

resetBtn.addEventListener('click', () =>{
    expenses = [];
    localStorage.removeItem('expenses');
    trackExpense();
    showSuccess('All expenses have been reset!');
    resetBtn.style.display = 'none';
});

function showAlert(message) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.padding = '10px 20px';
    popup.style.backgroundColor = '#ff4d4d';
    popup.style.color = 'white';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '1000';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => popup.remove(), 500);
    }, 2000);
}

function showSuccess(message) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.padding = '10px 20px';
    popup.style.backgroundColor = '#4dff85ff';
    popup.style.color = 'white';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '1000';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => popup.remove(), 500);
    }, 2000);
}