const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('triviaquiz')
        .setDescription('Start a trivia quiz with multiple rounds and scoring'),
    async execute(interaction) {
        const rounds = 5;
        let currentRound = 0;
        let score = 0;

        const getTriviaQuestion = async () => {
            const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
            const trivia = response.data.results[0];
            const options = [
                trivia.correct_answer,
                ...trivia.incorrect_answers
            ];

            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }

            return { trivia, options };
        };

        const askQuestion = async () => {
            const { trivia, options } = await getTriviaQuestion();
            const buttons = options.map((option, index) => new ButtonBuilder()
                .setCustomId(`option_${index}`)
                .setLabel(option)
                .setStyle(ButtonStyle.Primary)
            );

            const row = new ActionRowBuilder().addComponents(buttons);

            const embed = new EmbedBuilder()
                .setTitle(`Trivia Quiz - Round ${currentRound + 1}`)
                .setDescription(trivia.question)
                .setColor(0x00AE86);

            await interaction.editReply({ embeds: [embed], components: [row] });

            const filter = i => i.customId.startsWith('option_') && i.user.id === interaction.user.id;

            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 15000 });

            collector.on('collect', async i => {
                const selectedOption = options[parseInt(i.customId.split('_')[1])];
                if (selectedOption === trivia.correct_answer) {
                    score += 1;
                    await i.update({ content: 'Correct!', components: [], embeds: [] });
                } else {
                    await i.update({ content: `Wrong! The correct answer was: ${trivia.correct_answer}`, components: [], embeds: [] });
                }
                collector.stop();
                currentRound += 1;
                if (currentRound < rounds) {
                    askQuestion();
                } else {
                    interaction.followUp(`Quiz over! Your final score is ${score} out of ${rounds}.`);
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply({ content: 'Time\'s up! No answer was selected.', components: [], embeds: [] });
                    currentRound += 1;
                    if (currentRound < rounds) {
                        askQuestion();
                    } else {
                        interaction.followUp(`Quiz over! Your final score is ${score} out of ${rounds}.`);
                    }
                }
            });
        };

        await interaction.reply('Starting trivia quiz...');
        askQuestion();
    },
};