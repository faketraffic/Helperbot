const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Tells a random dad joke'),
    async execute(interaction) {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/dadjoke');
            await interaction.reply(response.data.joke);
        } catch (error) {
            console.error('Error fetching dad joke:', error);
            await interaction.reply('An error occurred while fetching a dad joke. Please try again later.');
        }
    },
};
