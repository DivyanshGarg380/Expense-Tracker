const dateElement = document.getElementById('date');
const addExpenseBtn = document.getElementById('add-expense');
const expenseTypeInput = document.getElementById('expense-type');
const expenseAmountInput = document.getElementById('expense-amount');
const resetBtn = document.getElementById('reset-btn');
const expenseLimitInput = document.getElementById('daily-limit');
const dailyLimitBtn = document.getElementById('set-limit-btn');
const dailyLimitDisplay = document.getElementById('daily-limit-display');
const expenseSection = document.getElementById('expense-section');

const today = new Date();
dateElement.textContent = today.toDateString();

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let dailyLimit = parseFloat(localStorage.getItem('dailyLimit')) || 0;

if (dailyLimit > 0) {
    dailyLimitDisplay.style.display = 'block';
    dailyLimitDisplay.textContent = `Daily Limit: ₹${dailyLimit.toFixed(2)}`;
    expenseLimitInput.style.display = 'none';
    dailyLimitBtn.style.display = 'none';
    expenseSection.style.display = 'flex';
} else {
    dailyLimitDisplay.style.display = 'none';
    expenseSection.style.display = 'none';
}

if (expenses.length > 0) resetBtn.style.display = 'block';
trackExpense();

addExpenseBtn.addEventListener('click', () => {
    const purchaseType = expenseTypeInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    if (amount <= 0 || isNaN(amount) || purchaseType === '') {
        showAlert('Please enter a valid expense type and amount');
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

dailyLimitBtn.addEventListener('click', () => {
    const limit = parseFloat(expenseLimitInput.value);
    if (isNaN(limit) || limit <= 0) {
        showAlert('Please enter a valid daily limit');
        return;
    }

    dailyLimit = limit;
    localStorage.setItem('dailyLimit', dailyLimit);
    expenseLimitInput.value = '';

    dailyLimitDisplay.textContent = `Daily Limit: ₹${dailyLimit.toFixed(2)}`;
    dailyLimitDisplay.style.color = '#4dff85ff';
    dailyLimitDisplay.style.display = 'block';

    expenseLimitInput.style.display = 'none';
    dailyLimitBtn.style.display = 'none';
    expenseSection.style.display = 'flex';

    showSuccess(`Daily limit set to ₹${dailyLimit.toFixed(2)}`);
});

function trackExpense() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    let totalSpent = 0;

    expenses.forEach(expense => {
        totalSpent += expense.amount;
        const li = document.createElement('li');
        li.textContent = `${expense.type}: ₹${expense.amount.toFixed(2)}`;
        li.classList.add('expense-item');
        expenseList.appendChild(li);
    });

    if (dailyLimit > 0) {
        dailyLimitDisplay.textContent = `Daily Limit: ₹${dailyLimit.toFixed(2)} | Spent: ₹${totalSpent.toFixed(2)}`;
        if (totalSpent < dailyLimit) {
            dailyLimitDisplay.style.color = '#4dff85ff'; 
        } else if (totalSpent === dailyLimit) {
            dailyLimitDisplay.style.color = '#4f5150ff'; 
        } else {
            dailyLimitDisplay.style.color = '#ff4d4d'; 
        }
    }
}

resetBtn.addEventListener('click', () => {
    expenses = [];
    dailyLimit = 0;
    localStorage.removeItem('expenses');
    localStorage.removeItem('dailyLimit');

    expenseSection.style.display = 'none';
    expenseLimitInput.style.display = 'inline-block';
    dailyLimitBtn.style.display = 'inline-block';
    dailyLimitDisplay.style.display = 'none';

    trackExpense();
    showSuccess('All expenses have been reset!');
    resetBtn.style.display = 'none';
});

function showAlert(message) {
    createPopup(message, '#ff4d4d');
}

function showSuccess(message) {
    createPopup(message, '#4dff85ff');
}

function createPopup(message, bgColor) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.padding = '10px 20px';
    popup.style.backgroundColor = bgColor;
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

// Weather Feature idhar se
import API_KEY from './key.js';
const weatherInfo = document.getElementById('weather-info');
const weatherContainer = document.querySelector('.weather');
const weatherIcon = document.createElement('img');

async function fetchWeather(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const condition = data.weather[0].main.toLowerCase();
        const iconMap = {
        clear: 'clear',
        clouds: 'clouds',
        drizzle: 'drizzle',
        mist: 'mist',
        rain: 'rain',
        snow: 'snow'
        };
        
        const iconFile = iconMap[condition] || 'clear';
        const weatherIcon = document.querySelector('.weather-icon');
        weatherIcon.src = `./icons/${iconFile}.png`;
        weatherInfo.textContent = `${data.weather[0].main}, ${temp}°C`;
    }
    catch (error) {
        showAlert('Failed to fetch weather data');
    }
}

navigator.geolocation.getCurrentPosition(
  (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
  () => showAlert('Geolocation permission denied')
);