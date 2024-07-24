const { SlashCommandBuilder } = require('discord.js');
const { getShopItems } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('List items available for purchase'),
    async execute(interaction) {
        const shopItems = getShopItems();
        let response = 'Available items in the shop:\n';

        shopItems.forEach(item => {
            response += `**${item.name}** - $${item.price}: ${item.description}\n`;
        });

        await interaction.reply(response);
    },
};
