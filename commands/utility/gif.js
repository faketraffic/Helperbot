const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { giphyApiKey } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Fetch a GIF based on a keyword')
        .addStringOption(option => 
            option.setName('keyword')
                .setDescription('The keyword to search for a GIF')
                .setRequired(true)),
    async execute(interaction) {
        const keyword = interaction.options.getString('keyword');
        
        try {
            const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
                params: {
                    api_key: giphyApiKey,
                    q: keyword,
                    limit: 1,
                    rating: 'g'
                }
            });

            const gifUrl = response.data.data[0]?.images?.original?.url;
            if (!gifUrl) {
                await interaction.reply(`No GIFs found for keyword: ${keyword}`);
                return;
            }

            await interaction.reply(gifUrl);
        } catch (error) {
            console.error('Error fetching GIF:', error);
            await interaction.reply('An error occurred while fetching the GIF. Please try again later.');
        }
    },
};
