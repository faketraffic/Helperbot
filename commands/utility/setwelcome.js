const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Set a custom welcome message for new members')
        .addStringOption(option => option.setName('message').setDescription('The welcome message').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const welcomeMessage = interaction.options.getString('message');
        
        await interaction.reply({ content: `Welcome message set to: "${welcomeMessage}"`, ephemeral: true });
    },
};
