const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user')
        .addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);
        if (member) {
            await member.ban();
            await interaction.reply({ content: `${target.tag} has been banned.`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'User not found.', ephemeral: true });
        }
    },
};
