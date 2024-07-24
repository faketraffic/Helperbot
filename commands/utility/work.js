const { SlashCommandBuilder } = require('discord.js');
const { getUserData, updateUserData, getJobs } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Perform work to earn a set amount of money'),
    async execute(interaction) {
        const userData = getUserData(interaction.user.id);

        if (!userData.job) {
            return interaction.reply('You do not have a job. Use /job to get a job.');
        }

        const job = getJobs().find(job => job.name === userData.job);
        if (!job) {
            return interaction.reply('Error finding your job details. Please try again later.');
        }

        userData.balance += job.income;
        updateUserData(interaction.user.id, userData);

        await interaction.reply(`You worked as a ${job.name} and earned $${job.income}. Your new balance is $${userData.balance}.`);
    },
};
