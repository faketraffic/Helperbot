const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a user')
        .addUserOption(option => option.setName('target').setDescription('The user to unmute').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);
        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (member && muteRole) {
            await member.roles.remove(muteRole);
            await interaction.reply({ content: `${target.tag} has been unmuted.`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'User or mute role not found.', ephemeral: true });
        }
    },
};
