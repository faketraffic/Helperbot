const { SlashCommandBuilder } = require('discord.js');
const { getUserData, updateUserData } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Attempt to rob another user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to rob')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        if (target.id === interaction.user.id) {
            return interaction.reply('You cannot rob yourself!');
        }

        const userData = getUserData(interaction.user.id);
        const targetData = getUserData(target.id);

        const success = Math.random() < 0.1; // 10% chance to succeed

        if (success) {
            const stolenAmount = Math.floor(targetData.balance / 2);
            targetData.balance -= stolenAmount;
            userData.balance += stolenAmount;

            updateUserData(target.id, targetData);
            updateUserData(interaction.user.id, userData);

            return interaction.reply(`You successfully robbed $${stolenAmount} from ${target.tag}!`);
        } else {
            const penalty = Math.floor(userData.balance * 0.1);
            userData.balance -= penalty;

            updateUserData(interaction.user.id, userData);

            return interaction.reply(`You failed to rob ${target.tag} and lost $${penalty}.`);
        }
    },
};
