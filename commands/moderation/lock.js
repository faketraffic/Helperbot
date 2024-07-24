const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Locks a channel to prevent users from sending messages'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const channel = interaction.channel;
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SEND_MESSAGES: false });

        await interaction.reply({ content: `This channel has been locked.`, ephemeral: true });
    },
};
