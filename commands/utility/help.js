const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides information about all available commands'),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setTitle('Help - List of Commands')
            .setDescription('Here are all the available commands:')
            .addFields(
                { name: '/tictactoe', value: 'Play a game of Tic Tac Toe with another user.' },
                { name: '/triviaquiz', value: 'Start a trivia quiz with multiple rounds and scoring.' },
                { name: '/warn', value: 'Issue a warning to a user and log it.' },
                { name: '/lock', value: 'Lock a channel to prevent users from sending messages.' },
                { name: '/setwelcome', value: 'Set a custom welcome message for new members.' },
                { name: '/ban', value: 'Bans a user from the server.' },
                { name: '/kick', value: 'Kicks a user from the server.' },
                { name: '/mute', value: 'Mutes a user in the server.' },
                { name: '/unmute', value: 'Unmutes a user in the server.' },
                { name: '/clear', value: 'Clears a specified number of messages in a channel.' },
                { name: '/joke', value: 'Sends a random dad joke fetched from the local API.' },
                { name: '/ping', value: 'Replies with Pong!' },
                { name: '/coinflip', value: 'Flips a coin and returns heads or tails.' },
                { name: '/diceroll', value: 'Rolls a dice and returns the result.' },
                { name: '/trivia', value: 'Fetches a random trivia question.' },
                { name: '/define', value: 'Fetches a definition from Urban Dictionary for a specified term.' },
                { name: '/weather', value: 'Fetches the current weather for a specified location.' },
                { name: '/cat', value: 'Fetches a random cat picture.' },
                { name: '/dog', value: 'Fetches a random dog picture.' }
            )
            .setColor(0x00AE86);

        await interaction.reply({ embeds: [helpEmbed] });
    },
};
