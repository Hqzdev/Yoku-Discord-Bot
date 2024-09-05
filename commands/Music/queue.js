const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Check music queue'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
