const { SlashCommandBuilder } = require('discord.js');
const { getUserData } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your balance'),
    async execute(interaction) {
        const userData = getUserData(interaction.user.id);
        await interaction.reply(`Your balance is $${userData.balance}.`);
    },
};
