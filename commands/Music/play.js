const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('on music'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
