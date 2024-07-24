const { SlashCommandBuilder } = require('discord.js');
const { getUserData } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skills')
        .setDescription('Check your current skills and levels'),
    async execute(interaction) {
        const userData = getUserData(interaction.user.id);

        await interaction.reply(`Your total experience is ${userData.experience}.`);
    },
};
