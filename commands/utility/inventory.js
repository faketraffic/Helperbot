const { SlashCommandBuilder } = require('discord.js');
const { getUserData } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Check items in your inventory'),
    async execute(interaction) {
        const userData = getUserData(interaction.user.id);
        const inventory = userData.inventory.join(', ') || 'Your inventory is empty.';

        await interaction.reply(`Your inventory: ${inventory}`);
    },
};
