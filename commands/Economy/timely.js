const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timely')
		.setDescription('buy roles in the shop.'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
