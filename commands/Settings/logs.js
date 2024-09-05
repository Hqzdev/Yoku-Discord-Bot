const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logs')
		.setDescription('On logs in the server'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
