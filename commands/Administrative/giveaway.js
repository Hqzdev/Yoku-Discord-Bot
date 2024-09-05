const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('create a giveaway'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
