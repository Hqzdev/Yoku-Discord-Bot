const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-money')
		.setDescription('Check bans board'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
