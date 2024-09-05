const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pay')
		.setDescription('give money other member'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
