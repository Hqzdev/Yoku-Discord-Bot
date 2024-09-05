const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('convert')
		.setDescription('convert your balance'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
