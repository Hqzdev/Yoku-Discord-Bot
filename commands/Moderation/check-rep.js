const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check-rep')
		.setDescription('Check rep'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
