const { SlashCommandBuilder } = require('discord.js');
const { getUserData, updateUserData } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Gamble a specified amount of money for a chance to win or lose')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money to gamble')
                .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const userData = getUserData(interaction.user.id);

        if (amount > userData.balance) {
            return interaction.reply('You do not have enough money to gamble that amount.');
        }

        const win = Math.random() < 0.5; // 50% chance to win
        if (win) {
            userData.balance += amount;
            updateUserData(interaction.user.id, userData);
            await interaction.reply(`You won $${amount}! Your new balance is $${userData.balance}.`);
        } else {
            userData.balance -= amount;
            updateUserData(interaction.user.id, userData);
            await interaction.reply(`You lost $${amount}. Your new balance is $${userData.balance}.`);
        }
    },
};
