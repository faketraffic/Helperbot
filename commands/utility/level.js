const { SlashCommandBuilder } = require('discord.js');
const leveling = require('../../utils/leveling.js'); // Correct path to leveling.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Check your current level'),
    async execute(interaction) {
        const userLevel = leveling.getUserLevel(interaction.user.id, interaction.guild.id);
        await interaction.reply(`You are currently level ${userLevel}.`);
    },
};
