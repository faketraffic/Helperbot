const { SlashCommandBuilder } = require('discord.js');
const { getUserData, updateUserData } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('study')
        .setDescription('Spend time studying to improve skills'),
    async execute(interaction) {
        const userData = getUserData(interaction.user.id);
        const gainedXP = 20;

        userData.experience += gainedXP;
        updateUserData(interaction.user.id, userData);

        await interaction.reply(`You studied and gained ${gainedXP} experience points. Your total experience is now ${userData.experience}.`);
    },
};
