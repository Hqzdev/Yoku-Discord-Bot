const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Pong!',

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor('#303135') 
      .setTitle('Pong!')
      .setDescription(`Client: ${ping}ms | Websocket: ${client.ws.ping}ms`);

    await interaction.editReply({ embeds: [embed] });
  },
};
