const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll with up to 5 options')
        .addStringOption(option => option.setName('question').setDescription('The poll question').setRequired(true))
        .addStringOption(option => option.setName('option1').setDescription('Option 1').setRequired(true))
        .addStringOption(option => option.setName('option2').setDescription('Option 2').setRequired(true))
        .addStringOption(option => option.setName('option3').setDescription('Option 3').setRequired(false))
        .addStringOption(option => option.setName('option4').setDescription('Option 4').setRequired(false))
        .addStringOption(option => option.setName('option5').setDescription('Option 5').setRequired(false)),
    async execute(interaction) {
        // Check if the user has the administrator permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const question = interaction.options.getString('question');
        const options = [
            interaction.options.getString('option1'),
            interaction.options.getString('option2'),
            interaction.options.getString('option3'),
            interaction.options.getString('option4'),
            interaction.options.getString('option5')
        ].filter(option => option !== null);

        let votes = options.map(() => 0);
        let voters = {};

        const createPollOptions = () => {
            return options.map((option, index) => ({
                label: option,
                value: `${index}`
            }));
        };

        const createPollEmbed = () => {
            const totalVotes = votes.reduce((a, b) => a + b, 0);
            const description = options.map((option, index) => {
                const voteCount = votes[index];
                const percentage = totalVotes === 0 ? 0 : (voteCount / totalVotes * 100).toFixed(2);
                return `${option}: ${voteCount} vote(s) (${percentage}%)`;
            }).join('\n');

            const leadingOption = options[votes.indexOf(Math.max(...votes))];

            return new EmbedBuilder()
                .setTitle('Poll')
                .setDescription(`${question}\n\n${description}`)
                .addFields({ name: 'Leading Option', value: leadingOption || 'No votes yet' })
                .setColor(0x00AE86);
        };

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('poll_select')
            .setPlaceholder('Choose an option')
            .addOptions(createPollOptions());

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const embed = createPollEmbed();

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'poll_select';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const userId = i.user.id;
            const selectedOption = parseInt(i.values[0]);

            if (voters[userId] !== undefined) {
                votes[voters[userId]]--;
            }
            votes[selectedOption]++;
            voters[userId] = selectedOption;

            const updatedEmbed = createPollEmbed();
            await i.update({ embeds: [updatedEmbed], components: [row] });
        });

        collector.on('end', collected => {
            interaction.editReply({ content: 'Poll ended.', components: [] });
        });
    },
};
