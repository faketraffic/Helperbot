const { SlashCommandBuilder } = require('discord.js');
const { getUserData, updateUserData, getJobs } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job')
        .setDescription('Get a random job assigned to earn a daily income'),
    async execute(interaction) {
        const userData = getUserData(interaction.user.id);
        const jobs = getJobs();

        if (userData.job) {
            return interaction.reply(`You already have a job as a ${userData.job}. Use /quitjob to quit your current job.`);
        }

        const availableJobs = jobs.filter(job => userData.experience >= job.requiredXP);
        if (availableJobs.length === 0) {
            return interaction.reply('You do not have enough experience for any jobs. Study to gain more experience.');
        }

        const job = availableJobs[Math.floor(Math.random() * availableJobs.length)];
        userData.job = job.name;
        updateUserData(interaction.user.id, userData);

        await interaction.reply(`You got a job as a ${job.name}! You will earn $${job.income} daily.`);
    },
};
