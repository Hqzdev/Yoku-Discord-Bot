const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Check leaderboard'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
