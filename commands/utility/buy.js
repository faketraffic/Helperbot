const { SlashCommandBuilder } = require('discord.js');
const { getUserData, updateUserData, getShopItems } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Purchase an item from the shop')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('The item to purchase')
                .setRequired(true)),
    async execute(interaction) {
        const itemName = interaction.options.getString('item');
        const userData = getUserData(interaction.user.id);
        const shopItems = getShopItems();
        const item = shopItems.find(i => i.name.toLowerCase() === itemName.toLowerCase());

        if (!item) {
            return interaction.reply('That item is not available in the shop.');
        }

        if (userData.balance < item.price) {
            return interaction.reply(`You do not have enough money to buy ${item.name}.`);
        }

        userData.balance -= item.price;
        userData.inventory.push(item.name);
        updateUserData(interaction.user.id, userData);

        await interaction.reply(`You have purchased ${item.name} for $${item.price}. Your new balance is $${userData.balance}.`);
    },
};
