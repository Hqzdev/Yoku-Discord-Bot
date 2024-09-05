const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-music')
		.setDescription('Set music and invite Yoku in the voice channel'),
	async execute(interaction) {
		await interaction.reply(`This command is not work, wait...`);
	},
};
