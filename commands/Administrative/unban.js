const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('unban the member'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
