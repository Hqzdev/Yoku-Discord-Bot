const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop music'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
