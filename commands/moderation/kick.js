const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user')
        .addUserOption(option => option.setName('target').setDescription('The user to kick').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);
        if (member) {
            await member.kick();
            await interaction.reply({ content: `${target.tag} has been kicked.`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'User not found.', ephemeral: true });
        }
    },
};
