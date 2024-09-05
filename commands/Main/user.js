const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('User information'),
	async execute(interaction) {
		await interaction.reply(`✅ | This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};
