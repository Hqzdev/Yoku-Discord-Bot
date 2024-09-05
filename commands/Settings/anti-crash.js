const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anti-crash')
		.setDescription('Protect your server'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
