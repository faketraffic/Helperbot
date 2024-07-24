const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Fetches a random cat picture'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search');
            const cat = response.data[0];
            await interaction.reply({ files: [cat.url] });
        } catch (error) {
            console.error('Error fetching cat picture:', error);
            await interaction.reply({ content: 'Could not fetch a cat picture at this time.', ephemeral: true });
        }
    },
};
