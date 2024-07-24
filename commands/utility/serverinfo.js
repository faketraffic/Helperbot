const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Display information about the server'),
    async execute(interaction) {
        const { guild } = interaction;
        const embed = new EmbedBuilder()
            .setTitle(`Server Info: ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: 'Server ID', value: guild.id, inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Created On', value: `${guild.createdAt.toDateString()}`, inline: true },
                { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true }
            )
            .setColor(0x00AE86);

        await interaction.reply({ embeds: [embed] });
    },
};
