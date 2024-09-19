const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User'); 



module.exports = {
  name: 'convert',
  description: 'Convert your currency!',
  options: [
    {
      name: 'amount',
      description: 'How many premium coins do you want to get',
      type: 4, 
      required: true, 
    },
  ],
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('You can only run this command inside a server.')
        .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');

      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (!user) {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription('You don\'t have a profile yet.')
          .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
        interaction.editReply({ embeds: [embed] });
        return;
      }

      const amountToConvert = interaction.options.getInteger('amount'); 

      if (amountToConvert > user.balance) {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription('You don\'t have enough currency to convert this amount.\n```Сoin rate: 1 to 1000````')
          .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
        interaction.editReply({ embeds: [embed] });
        return;
      }
      const conversionRate = 1000; 
      const bank = amountToConvert * conversionRate;
      user.default -= amountToConvert * conversionRate;
      user.premium += amountToConvert
      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`> You get **${amountToConvert}** premium coin(s)\n > You can also buy roles for **premium coins** if write __/shop__ command`)
        .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /convert: ${error}`);
    }
  },
};
