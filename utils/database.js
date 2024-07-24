const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'database.json');

let data = {};
if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath));
}

function saveData() {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function getUserData(userId) {
    if (!data[userId]) {
        data[userId] = { balance: 250, level: 1, xp: 0, job: null, skills: {}, experience: 0, inventory: [] };
        saveData();
    }
    return data[userId];
}

function updateUserData(userId, newData) {
    data[userId] = { ...data[userId], ...newData };
    saveData();
}

function getLeaderboard(type) {
    return Object.entries(data)
        .map(([userId, userData]) => ({ userId, ...userData }))
        .sort((a, b) => b[type] - a[type])
        .slice(0, 10);
}

const jobs = [
    { name: 'Janitor', income: 50, requiredXP: 0 },
    { name: 'Cashier', income: 100, requiredXP: 50 },
    { name: 'Software Developer', income: 200, requiredXP: 200 },
    { name: 'Manager', income: 300, requiredXP: 500 },
    // Add more jobs as needed
];

function getJobs() {
    return jobs;
}

const shopItems = [
    { name: 'Robber', description: 'Increases your chance of successful robbery by 10%', price: 100 },
    { name: 'Protection', description: 'Decreases the chance of being robbed by 10%', price: 100 },
    { name: 'Blank Card', description: 'A blank card for future use', price: 50 }
];

function getShopItems() {
    return shopItems;
}

module.exports = {
    getUserData,
    updateUserData,
    getLeaderboard,
    getJobs,
    getShopItems,
};
