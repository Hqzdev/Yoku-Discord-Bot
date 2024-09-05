const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Setup the Yoku'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
