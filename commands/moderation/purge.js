const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete a channel and recreate it')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to purge')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const channelName = channel.name;
        const channelPosition = channel.position;
        const channelParent = channel.parent;
        const channelPermissions = channel.permissionOverwrites.cache;

        try {
            await channel.delete();
            const newChannel = await channel.guild.channels.create({
                name: channelName,
                type: channel.type,
                parent: channelParent,
                permissionOverwrites: channelPermissions,
                position: channelPosition
            });
            await interaction.reply(`Channel ${channelName} has been purged and recreated.`);
        } catch (error) {
            console.error('Error purging channel:', error);
            await interaction.reply('An error occurred while purging the channel. Please try again later.');
        }
    },
};
