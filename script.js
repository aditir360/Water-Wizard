const waterForm = document.getElementById('water-form');
const showersInput = document.getElementById('showers');
const dishwashingInput = document.getElementById('dishwashing');
const gardenWateringInput = document.getElementById('garden-watering');
const tipsList = document.getElementById('tips-list');
const leaderboardList = document.getElementById('leaderboard');
const goalForm = document.getElementById('goal-form');
const goalInput = document.getElementById('goal-input');
const goalList = document.getElementById('goal-list');
const alertButton = document.getElementById('alert-button');
const alertInfo = document.getElementById('alert-info');
const alertTimer = document.getElementById('alert-timer');
const ctx = document.getElementById('usageChart').getContext('2d');

let leaderboard = [
    { name: 'Alice', score: 85 },
    { name: 'Bob', score: 78 },
    { name: 'Charlie', score: 92 }
];

let usageData = {
    showers: 0,
    dishwashing: 0,
    gardenWatering: 0
};

let goals = [];
let alertEnabled = false;
let alertInterval = 60; // in minutes

const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Showers', 'Dishwashing', 'Garden Watering'],
        datasets: [{
            label: 'Water Usage (minutes)',
            data: [usageData.showers, usageData.dishwashing, usageData.gardenWatering],
            backgroundColor: [
                '#03045e',
                '#0077b6',
                '#00b4d8'
            ],
            borderColor: [
                '#03045e',
                '#0077b6',
                '#00b4d8'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

waterForm.addEventListener('submit', generateTips);
goalForm.addEventListener('submit', addGoal);
alertButton.addEventListener('click', toggleAlerts);

function generateTips(e) {
    e.preventDefault();

    const showers = parseInt(showersInput.value);
    const dishwashing = parseInt(dishwashingInput.value);
    const gardenWatering = parseInt(gardenWateringInput.value);

    usageData = { showers, dishwashing, gardenWatering };
    updateChart();

    tipsList.innerHTML = '';

    const tips = getWaterSavingTips(showers, dishwashing, gardenWatering);

    tips.forEach(tip => {
        const listItem = document.createElement('li');
        listItem.textContent = tip;
        tipsList.appendChild(listItem);
    });

    // Reset form inputs
    showersInput.value = '';
    dishwashingInput.value = '';
    gardenWateringInput.value = '';
}

function getWaterSavingTips(showers, dishwashing, gardenWatering) {
    let tips = [];

    // Basic logic for generating tips
    if (showers > 10) {
        tips.push('Try to limit your showers to 10 minutes or less.');
    } else {
        tips.push('Great job keeping your showers under 10 minutes!');
    }

    if (dishwashing > 15) {
        tips.push('Consider using a dishwasher instead of washing dishes by hand to save water.');
    } else {
        tips.push('You are using a reasonable amount of time for dishwashing.');
    }

    if (gardenWatering > 20) {
        tips.push('Try watering your garden early in the morning or late in the evening to reduce evaporation.');
    } else {
        tips.push('Your garden watering time is efficient.');
    }

    return tips;
}

function updateChart() {
    chart.data.datasets[0].data = [usageData.showers, usageData.dishwashing, usageData.gardenWatering];
    chart.update();
}

// Initialize leaderboard
function updateLeaderboard() {
    leaderboardList.innerHTML = '';

    leaderboard.sort((a, b) => b.score - a.score).forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.name}: ${entry.score} points`;
        leaderboardList.appendChild(listItem);
    });
}

updateLeaderboard();

function addGoal(e) {
    e.preventDefault();

    const goalText = goalInput.value.trim();
    if (goalText !== '') {
        goals.push(goalText);
        renderGoals();
        goalInput.value = '';
    }
}

function renderGoals() {
    goalList.innerHTML = '';

    goals.forEach((goal, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = goal;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Check Off';
        removeButton.addEventListener('click', () => {
            goals.splice(index, 1);
            renderGoals();
        });

        listItem.appendChild(removeButton);
        goalList.appendChild(listItem);
    });
}

function toggleAlerts() {
    alertEnabled = !alertEnabled;
    if (alertEnabled) {
        alertInfo.classList.remove('hidden');
        alertInfo.classList.add('visible');
        updateAlertTimer();
    } else {
        alertInfo.classList.remove('visible');
        alertInfo.classList.add('hidden');
    }
}

function updateAlertTimer() {
    if (alertEnabled) {
        setInterval(() => {
            let remainingTime = parseInt(alertTimer.textContent);
            if (remainingTime > 0) {
                remainingTime -= 1;
                alertTimer.textContent = remainingTime;
            } else {
                alert('This is your water conservation reminder!');
                alertTimer.textContent = alertInterval;
            }
        }, 60000); // Update every minute
    }
}
