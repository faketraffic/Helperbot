const { SlashCommandBuilder } = require('discord.js');
const { getUserData, updateUserData } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription('Place a bet on a specific option in a game')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money to bet')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option')
                .setDescription('The option to bet on')
                .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const option = interaction.options.getString('option').toLowerCase();
        const userData = getUserData(interaction.user.id);

        if (amount > userData.balance) {
            return interaction.reply('You do not have enough money to bet that amount.');
        }

        const winningOption = Math.random() < 0.5 ? 'heads' : 'tails'; // Simplified bet options

        if (option === winningOption) {
            const winnings = amount * 2;
            userData.balance += winnings;
            updateUserData(interaction.user.id, userData);
            await interaction.reply(`You bet on ${option} and won! You gained $${winnings}. Your new balance is $${userData.balance}.`);
        } else {
            userData.balance -= amount;
            updateUserData(interaction.user.id, userData);
            await interaction.reply(`You bet on ${option} and lost. The winning option was ${winningOption}. You lost $${amount}. Your new balance is $${userData.balance}.`);
        }
    },
};
