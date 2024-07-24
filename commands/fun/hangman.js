const { SlashCommandBuilder } = require('discord.js');

const words = ['discord', 'javascript', 'bot', 'hangman', 'coding', 'development'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Play a game of Hangman'),
    async execute(interaction) {
        const word = words[Math.floor(Math.random() * words.length)];
        let hiddenWord = word.split('').map(() => '_').join(' ');
        let attempts = 6;
        let guessedLetters = [];

        const filter = response => response.author.id === interaction.user.id && /^[a-zA-Z]$/.test(response.content);
        const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

        await interaction.reply(`Let's play Hangman! Word: \`${hiddenWord}\``);

        collector.on('collect', async message => {
            const letter = message.content.toLowerCase();
            if (guessedLetters.includes(letter)) {
                await message.reply('You already guessed that letter!');
                return;
            }

            guessedLetters.push(letter);
            if (word.includes(letter)) {
                hiddenWord = word.split('').map(l => guessedLetters.includes(l) ? l : '_').join(' ');
            } else {
                attempts -= 1;
            }

            if (hiddenWord === word) {
                collector.stop();
                await interaction.followUp(`You guessed the word! It was \`${word}\`.`);
            } else if (attempts === 0) {
                collector.stop();
                await interaction.followUp(`Game over! The word was \`${word}\`.`);
            } else {
                await interaction.followUp(`Word: \`${hiddenWord}\` Attempts left: ${attempts}`);
            }
        });

        collector.on('end', collected => {
            if (hiddenWord !== word && attempts > 0) {
                interaction.followUp('Time is up! Better luck next time.');
            }
        });
    },
};
