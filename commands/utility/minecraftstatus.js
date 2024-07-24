const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraftstatus')
        .setDescription('Check the status of a Minecraft server')
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('The IP address of the Minecraft server')
                .setRequired(true)),
    async execute(interaction) {
        const ip = interaction.options.getString('ip');

        try {
            const response = await axios.get(`https://api.mcsrvstat.us/2/${ip}`);
            const data = response.data;

            if (!data.online) {
                return interaction.reply(`The server \`${ip}\` is offline.`);
            }

            const embed = new EmbedBuilder()
                .setTitle(`Minecraft Server Status - ${ip}`)
                .setColor(0x00FF00)
                .addFields(
                    { name: 'Status', value: 'Online', inline: true },
                    { name: 'Players', value: `${data.players.online} / ${data.players.max}`, inline: true },
                    { name: 'Version', value: data.version, inline: true },
                    { name: 'MOTD', value: data.motd.clean.join('\n'), inline: true },
                    { name: 'Ping', value: `${data.debug.ping} ms`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching server status:', error);
            await interaction.reply('An error occurred while retrieving the server status. Please try again later.');
        }
    },
};
