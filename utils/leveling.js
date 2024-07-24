const fs = require('fs');
const path = require('path');

// Path to store leveling data
const dataPath = path.join(__dirname, 'levelingData.json');

// Load leveling data
let levelingData = {};
if (fs.existsSync(dataPath)) {
    levelingData = JSON.parse(fs.readFileSync(dataPath));
}

// Function to save leveling data
function saveLevelingData() {
    fs.writeFileSync(dataPath, JSON.stringify(levelingData, null, 2));
}

// Function to add XP to a user
function addXP(userId, guildId, xp) {
    if (!levelingData[guildId]) {
        levelingData[guildId] = {};
    }

    if (!levelingData[guildId][userId]) {
        levelingData[guildId][userId] = {
            xp: 0,
            level: 1
        };
    }

    levelingData[guildId][userId].xp += xp;

    const currentLevel = levelingData[guildId][userId].level;
    const nextLevelXP = currentLevel * 100;

    if (levelingData[guildId][userId].xp >= nextLevelXP) {
        levelingData[guildId][userId].level += 1;
        levelingData[guildId][userId].xp = 0;
        saveLevelingData();
        return true; // User leveled up
    }

    saveLevelingData();
    return false; // User did not level up
}

// Function to get user level
function getUserLevel(userId, guildId) {
    if (levelingData[guildId] && levelingData[guildId][userId]) {
        return levelingData[guildId][userId].level;
    }
    return 1; // Default level
}

// Function to get leaderboard
function getLeaderboard(guildId) {
    if (!levelingData[guildId]) {
        return [];
    }

    const leaderboard = Object.entries(levelingData[guildId])
        .map(([userId, data]) => ({ userId, ...data }))
        .sort((a, b) => b.level - a.level || b.xp - a.xp)
        .slice(0, 10);

    return leaderboard;
}

module.exports = {
    addXP,
    getUserLevel,
    getLeaderboard
};
