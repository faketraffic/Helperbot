const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Fetches a definition from Urban Dictionary')
        .addStringOption(option => option.setName('term').setDescription('The term to define').setRequired(true)),
    async execute(interaction) {
        const term = interaction.options.getString('term');
        try {
            const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${term}`);
            const definition = response.data.list[0];
            await interaction.reply(`**${term}:** ${definition.definition}\n\n*${definition.example}*`);
        } catch (error) {
            console.error('Error fetching definition:', error);
            await interaction.reply({ content: 'Could not fetch definition at this time.', ephemeral: true });
        }
    },
};
