const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('next')
		.setDescription('On next music'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};

