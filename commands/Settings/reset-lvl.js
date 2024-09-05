const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset-lvl')
		.setDescription('reset all level'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
