const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User'); 

module.exports = {
  name: 'add-money',
  description: 'Add money to member',
  devOnly: true,
  options: [
    {
      name: 'user',
      description: 'Choice a member',
      required: true,
      type: ApplicationCommandOptionType.User, 
    },
    {
      name: 'amount',
      description: 'How much money you want to add this user?',
      required: true,
      type: 4,
    },
  ],
  callback: async (client, interaction) => {

    
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('You do not have permission to use this command.')
        .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      interaction.editReply({ embeds: [embed] });
      return;
    }

    try {
      await interaction.deferReply();

      
      const member = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount'); 

      
      let user = await User.findOne({ userId: member.id, guildId: interaction.guild.id });

      if (!user) {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription(`<@${member.id}> doesn't have a profile yet.`)
          .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
        interaction.editReply({ embeds: [embed] });
        return;
      }

      
      user.default += amount;
      await user.save();

      
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`> You added money **${amount}** to <@${member.id}> `)
        .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /add-money: ${error}`);
    }
  },
};
