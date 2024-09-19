const { Client, Interaction, EmbedBuilder } = require('discord.js');


module.exports = {
		name: 'server',
		description: 'Check server information',
		callback: async (client, interaction) => {

			const reply = await interaction.fetchReply();

			const embed = new EmbedBuilder
			.setColor('#303135')
			.setTitle('User Information')
			.setDescription(`<:37667checkmark:1268558027364106416> | This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
			await interaction.reply({ embeds: [embed] });
		},
	  };
	  