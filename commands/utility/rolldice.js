const { SlashCommandBuilder } = require('discord.js');
const { getUserData, updateUserData } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolldice')
        .setDescription('Roll a dice for a chance to win money')
        .addIntegerOption(option =>
            option.setName('bet')
                .setDescription('The amount of money to bet')
                .setRequired(true)),
    async execute(interaction) {
        const bet = interaction.options.getInteger('bet');
        const userData = getUserData(interaction.user.id);

        if (bet > userData.balance) {
            return interaction.reply('You do not have enough money to bet that amount.');
        }

        const dice = Math.floor(Math.random() * 6) + 1;
        if (dice === 6) {
            const winnings = bet * 5;
            userData.balance += winnings;
            updateUserData(interaction.user.id, userData);
            await interaction.reply(`You rolled a ${dice}! You won $${winnings}. Your new balance is $${userData.balance}.`);
        } else {
            userData.balance -= bet;
            updateUserData(interaction.user.id, userData);
            await interaction.reply(`You rolled a ${dice}. You lost $${bet}. Your new balance is $${userData.balance}.`);
        }
    },
};
