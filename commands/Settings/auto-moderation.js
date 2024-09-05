const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('auto-mod')
		.setDescription('Auto-moderating in this server'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
