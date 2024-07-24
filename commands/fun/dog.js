const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Fetches a random dog picture'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://dog.ceo/api/breeds/image/random');
            const dog = response.data;
            await interaction.reply({ files: [dog.message] });
        } catch (error) {
            console.error('Error fetching dog picture:', error);
            await interaction.reply({ content: 'Could not fetch a dog picture at this time.', ephemeral: true });
        }
    },
};
