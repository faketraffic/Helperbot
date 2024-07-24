const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guessthenumber')
        .setDescription('Guess the number between 1 and 100'),
    async execute(interaction) {
        const numberToGuess = Math.floor(Math.random() * 100) + 1;
        let attempts = 10;

        const filter = response => response.author.id === interaction.user.id && /^\d+$/.test(response.content);
        const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

        await interaction.reply('I have picked a number between 1 and 100. Try to guess it!');

        collector.on('collect', async message => {
            const guess = parseInt(message.content);
            attempts -= 1;

            if (guess === numberToGuess) {
                collector.stop();
                await interaction.followUp(`You guessed it! The number was ${numberToGuess}.`);
            } else if (attempts === 0) {
                collector.stop();
                await interaction.followUp(`Game over! The number was ${numberToGuess}.`);
            } else {
                const hint = guess < numberToGuess ? 'higher' : 'lower';
                await interaction.followUp(`Try again! Hint: It's ${hint}. Attempts left: ${attempts}`);
            }
        });

        collector.on('end', collected => {
            if (attempts > 0) {
                interaction.followUp('Time is up! Better luck next time.');
            }
        });
    },
};
