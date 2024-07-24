const { SlashCommandBuilder } = require('discord.js');
const { getUserData, updateUserData } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quitjob')
        .setDescription('Quit your current job'),
    async execute(interaction) {
        const userData = getUserData(interaction.user.id);

        if (!userData.job) {
            return interaction.reply('You do not have a job to quit.');
        }

        userData.job = null;
        updateUserData(interaction.user.id, userData);

        await interaction.reply('You have quit your job.');
    },
};
