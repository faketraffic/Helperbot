const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages')
        .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to clear').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const amount = interaction.options.getInteger('amount');
        if (amount > 100) {
            return interaction.reply({ content: 'You can only delete up to 100 messages at a time.', ephemeral: true });
        }
        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ content: `${amount} messages have been cleared.`, ephemeral: true });
    },
};
