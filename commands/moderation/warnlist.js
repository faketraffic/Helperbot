const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnlist')
        .setDescription('List all warnings for a user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to list warnings for')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Replace this with your actual warnings data retrieval logic
        const warnings = [
            { date: '2024-07-18', reason: 'Spamming' },
            { date: '2024-07-19', reason: 'Offensive language' }
        ]; // Simulated warnings data

        const embed = new EmbedBuilder()
            .setTitle(`Warnings for ${target.tag}`)
            .setColor(0xFF0000);

        if (warnings.length === 0) {
            embed.setDescription('No warnings found.');
        } else {
            warnings.forEach(warning => {
                embed.addFields(
                    { name: 'Date', value: warning.date, inline: true },
                    { name: 'Reason', value: warning.reason, inline: true }
                );
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
