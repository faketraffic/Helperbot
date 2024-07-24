const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Fetches the current weather for a specified location')
        .addStringOption(option => option.setName('location').setDescription('The location to fetch weather for').setRequired(true)),
    async execute(interaction) {
        const location = interaction.options.getString('location');
        try {
            const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=b6c6283c3b954e869b001216242007&q=${location}`);
            const weather = response.data;
            await interaction.reply(`The current weather in ${location} is ${weather.current.temp_c}°C (${weather.current.condition.text}).`);
        } catch (error) {
            console.error('Error fetching weather:', error);
            await interaction.reply({ content: 'Could not fetch weather at this time.', ephemeral: true });
        }
    },
};
