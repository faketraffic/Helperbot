const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarnings')
        .setDescription('Clear all warnings for a user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to clear warnings for')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Replace this with your actual warnings data clearing logic
        const warningsCleared = true; // Simulate clearing warnings

        if (warningsCleared) {
            await interaction.reply(`All warnings for ${target.tag} have been cleared.`);
        } else {
            await interaction.reply('An error occurred while clearing warnings. Please try again later.');
        }
    },
};
