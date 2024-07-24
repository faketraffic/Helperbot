const { SlashCommandBuilder } = require('discord.js');
const { getUserData, updateUserData } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lottery')
        .setDescription('Enter a lottery for a chance to win big'),
    async execute(interaction) {
        const ticketPrice = 50;
        const prize = 1000;
        const userData = getUserData(interaction.user.id);

        if (userData.balance < ticketPrice) {
            return interaction.reply('You do not have enough money to buy a lottery ticket.');
        }

        userData.balance -= ticketPrice;
        const win = Math.random() < 0.01; // 1% chance to win

        if (win) {
            userData.balance += prize;
            updateUserData(interaction.user.id, userData);
            await interaction.reply(`You won the lottery! Your prize is $${prize}. Your new balance is $${userData.balance}.`);
        } else {
            updateUserData(interaction.user.id, userData);
            await interaction.reply(`You did not win the lottery. Your balance is $${userData.balance}.`);
        }
    },
};
