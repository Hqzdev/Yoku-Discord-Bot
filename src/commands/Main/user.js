const { Client, Interaction, EmbedBuilder } = require('discord.js');


module.exports = {
		name: 'user',
		description: 'Check user information',
		callback: async (client, interaction) => {
			await interaction.deferReply();
			const embed = new EmbedBuilder
			.setColor('#303135')
			.setTitle('User Information')
			.setDescription(`<:37667checkmark:1268558027364106416> | This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
			await interaction.reply({ embeds: [embed] });
		},
	  };
	  
