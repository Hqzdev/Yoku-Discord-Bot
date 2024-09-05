const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('display a message on behalf of the bot'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
