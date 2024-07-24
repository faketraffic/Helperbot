const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Fetches a random trivia question'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
            const trivia = response.data.results[0];

            // Create an array of options including the correct answer
            const options = [
                trivia.correct_answer,
                ...trivia.incorrect_answers
            ];

            // Shuffle the options
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }

            // Create buttons for each option
            const buttons = options.map((option, index) => new ButtonBuilder()
                .setCustomId(`option_${index}`)
                .setLabel(option)
                .setStyle(ButtonStyle.Primary)
            );

            const row = new ActionRowBuilder().addComponents(buttons);

            const embed = new EmbedBuilder()
                .setTitle(`Trivia Question`)
                .setDescription(trivia.question)
                .setColor(0x00AE86);

            await interaction.reply({ embeds: [embed], components: [row] });

            const filter = i => i.customId.startsWith('option_') && i.user.id === interaction.user.id;

            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 15000 });

            collector.on('collect', async i => {
                const selectedOption = options[parseInt(i.customId.split('_')[1])];
                if (selectedOption === trivia.correct_answer) {
                    await i.update({ content: 'Correct! Well done!', components: [], embeds: [] });
                } else {
                    await i.update({ content: `Wrong! The correct answer was: ${trivia.correct_answer}`, components: [], embeds: [] });
                }
                collector.stop();
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply({ content: 'Time\'s up! No answer was selected.', components: [], embeds: [] });
                }
            });
        } catch (error) {
            console.error('Error fetching trivia:', error);
            await interaction.reply({ content: 'Could not fetch trivia at this time.', ephemeral: true });
        }
    },
};
