const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wouldyourather')
        .setDescription('Ask a "Would You Rather" question'),
    async execute(interaction) {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/wouldyourather');
            await interaction.reply(response.data.question);
        } catch (error) {
            console.error('Error fetching "Would You Rather" question:', error);
            await interaction.reply('An error occurred while fetching a "Would You Rather" question. Please try again later.');
        }
    },
};
