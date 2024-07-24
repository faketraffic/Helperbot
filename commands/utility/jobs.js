const { SlashCommandBuilder } = require('discord.js');
const { getJobs } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jobs')
        .setDescription('List available jobs and their daily income'),
    async execute(interaction) {
        const jobs = getJobs();
        let response = 'Available jobs:\n';

        jobs.forEach(job => {
            response += `**${job.name}** - Income: $${job.income}, Required XP: ${job.requiredXP}\n`;
        });

        await interaction.reply(response);
    },
};
