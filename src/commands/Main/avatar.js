const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Send your avatar',
  options: [
    {
      name: 'member',
      description: 'The user whose avatar you want to get.',
      type: ApplicationCommandOptionType.User,
    },
  ],


  callback: async (client, interaction) => {
    const member = interaction.member;
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const embed = new EmbedBuilder()
      .setColor('#303135')
      .setTitle(`<:7824member:1268590978768441437>${member.user.username} avatar`) 
      .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 })); 

    await interaction.reply({ embeds: [embed] });
  },
};

