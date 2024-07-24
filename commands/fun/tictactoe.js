const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Play a game of Tic Tac Toe with another user')
        .addUserOption(option => option.setName('opponent').setDescription('Select an opponent').setRequired(true)),
    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');
        if (opponent.id === interaction.user.id) {
            return interaction.reply({ content: 'You cannot play against yourself!', ephemeral: true });
        }

        const emptyBoard = [
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜']
        ];

        const renderBoard = board => board.map(row => row.join('')).join('\n');
        const createMenuOptions = () => {
            const options = [];
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (emptyBoard[row][col] === '⬜') {
                        options.push({
                            label: `Row ${row + 1}, Col ${col + 1}`,
                            value: `tictactoe_${row}_${col}`
                        });
                    }
                }
            }
            return options;
        };

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('tictactoe_menu')
            .setPlaceholder('Select a cell')
            .addOptions(createMenuOptions());

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const embed = new EmbedBuilder()
            .setTitle('Tic Tac Toe')
            .setDescription(`Current Turn: ${interaction.user.tag}\n${renderBoard(emptyBoard)}`)
            .setColor(0x00AE86);

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'tictactoe_menu' && (i.user.id === interaction.user.id || i.user.id === opponent.id);
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        let currentPlayer = interaction.user;
        let board = emptyBoard;
        let turns = 0;

        collector.on('collect', async i => {
            const [_, row, col] = i.values[0].split('_');
            if (board[row][col] !== '⬜') {
                return i.reply({ content: 'This spot is already taken!', ephemeral: true });
            }

            board[row][col] = currentPlayer.id === interaction.user.id ? '❌' : '⭕';
            turns += 1;

            if (checkWinner(board)) {
                await i.update({ embeds: [embed.setDescription(`Game Over! ${currentPlayer.tag} wins!\n${renderBoard(board)}`)], components: [] });
                collector.stop();
            } else if (turns === 9) {
                await i.update({ embeds: [embed.setDescription(`Game Over! It's a draw!\n${renderBoard(board)}`)], components: [] });
                collector.stop();
            } else {
                currentPlayer = currentPlayer.id === interaction.user.id ? opponent : interaction.user;
                selectMenu.setOptions(createMenuOptions());
                await i.update({ embeds: [embed.setDescription(`Current Turn: ${currentPlayer.tag}\n${renderBoard(board)}`)], components: [row] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'Game over! Time expired.', components: [] });
            }
        });

        function checkWinner(board) {
            const winningLines = [
                // Rows
                [board[0][0], board[0][1], board[0][2]],
                [board[1][0], board[1][1], board[1][2]],
                [board[2][0], board[2][1], board[2][2]],
                // Columns
                [board[0][0], board[1][0], board[2][0]],
                [board[0][1], board[1][1], board[2][1]],
                [board[0][2], board[1][2], board[2][2]],
                // Diagonals
                [board[0][0], board[1][1], board[2][2]],
                [board[0][2], board[1][1], board[2][0]]
            ];

            return winningLines.some(line => line.every(cell => cell === '❌') || line.every(cell => cell === '⭕'));
        }
    },
};
