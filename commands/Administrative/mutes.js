const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mutes')
		.setDescription('Check mutes board'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
