const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'invite',
  description: 'Invite Yoku',

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();


    const embed = new EmbedBuilder()
      .setColor('#303135') 
      .setTitle('Invite')
      .setDescription(`<:7824member:1268590978768441437> | [Click](https://discord.com/oauth2/authorize?client_id=1281304366153859125&permissions=8&integration_type=0&scope=bot+applications.commands)`);

    await interaction.editReply({ embeds: [embed] });
  },
};
