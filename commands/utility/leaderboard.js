const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLeaderboard } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Check the leaderboard')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of leaderboard (level or life)')
                .setRequired(true)
                .addChoices(
                    { name: 'Level', value: 'level' },
                    { name: 'Life (Cash)', value: 'balance' }
                )),
    async execute(interaction) {
        const type = interaction.options.getString('type');
        const leaderboard = getLeaderboard(type);
        const guild = interaction.guild;

        const embed = new EmbedBuilder()
            .setTitle(`${type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard`)
            .setColor(0x00AE86);

        if (leaderboard.length === 0) {
            embed.setDescription('No data available.');
        } else {
            for (const [index, user] of leaderboard.entries()) {
                const member = await guild.members.fetch(user.userId).catch(() => null);
                const tag = member ? member.user.tag : `Unknown User (${user.userId})`;

                embed.addFields(
                    { name: `#${index + 1} ${tag}`, value: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${user[type]}`, inline: false }
                );
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
