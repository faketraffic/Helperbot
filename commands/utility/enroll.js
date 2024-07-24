const { SlashCommandBuilder } = require('discord.js');
const { getUserData, updateUserData } = require('../../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enroll')
        .setDescription('Enroll in a course to learn a new skill')
        .addStringOption(option =>
            option.setName('course')
                .setDescription('The course you want to enroll in')
                .setRequired(true)),
    async execute(interaction) {
        const userData = getUserData(interaction.user.id);
        const course = interaction.options.getString('course');
        const courses = {
            'JavaScript Basics': 50,
            'Advanced Python': 100,
            'Project Management': 150,
            // Add more courses as needed
        };

        if (!courses[course]) {
            return interaction.reply('The specified course is not available.');
        }

        const cost = courses[course];
        if (userData.balance < cost) {
            return interaction.reply(`You do not have enough money to enroll in ${course}. You need $${cost}.`);
        }

        userData.balance -= cost;
        userData.experience += cost; // Assuming experience gained is equal to the course cost for simplicity
        updateUserData(interaction.user.id, userData);

        await interaction.reply(`You have enrolled in ${course}, spent $${cost}, and gained ${cost} experience points. Your new balance is $${userData.balance}.`);
    },
};
