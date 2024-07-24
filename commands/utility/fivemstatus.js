const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fivemstatus')
        .setDescription('Check the status of a FiveM server')
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('The IP address of the FiveM server')
                .setRequired(true)),
    async execute(interaction) {
        const ip = interaction.options.getString('ip');

        try {
            const response = await axios.get(`https://servers-live.fivem.net/api/servers/single/${ip}`);
            const data = response.data;

            if (!data || !data.Data) {
                return interaction.reply(`The server \`${ip}\` is offline or not found.`);
            }

            const serverData = data.Data;

            const embed = new EmbedBuilder()
                .setTitle(`FiveM Server Status - ${serverData.hostname}`)
                .setColor(0x00FF00)
                .addFields(
                    { name: 'Status', value: serverData.upvotePower > 0 ? 'Online' : 'Offline', inline: true },
                    { name: 'Players', value: `${serverData.clients} / ${serverData.sv_maxclients}`, inline: true },
                    { name: 'Game Type', value: serverData.gametype, inline: true },
                    { name: 'Map Name', value: serverData.mapname, inline: true },
                    { name: 'Ping', value: `${serverData.ping} ms`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching server status:', error);
            await interaction.reply('An error occurred while retrieving the server status. Please try again later.');
        }
    },
};
