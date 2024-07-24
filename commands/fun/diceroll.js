const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diceroll')
        .setDescription('Rolls a dice'),
    async execute(interaction) {
        const outcome = Math.floor(Math.random() * 6) + 1;
        await interaction.reply(`The dice rolled: ${outcome}`);
    },
};
