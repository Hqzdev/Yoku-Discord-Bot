const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

const dailyAmountMin = 500; // Minimum daily amount
const dailyAmountMax = 1500; // Maximum daily amount
const cooldownDuration = 10800000; // 3 hours in milliseconds

module.exports = {
  name: 'timely',
  description: 'Collect your money!',
  /*
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
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

      // Calculate cooldown
      const lastDaily = user ? user.lastDaily : new Date(0);
      const cooldownRemaining = cooldownDuration - (Date.now() - lastDaily.getTime());

      if (cooldownRemaining > 0) {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription(`> You can collect your reward in **${Math.round(cooldownRemaining / 3600000)}h.** `)
          .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      
        interaction.editReply({ embeds: [embed] });
        return;
      }

      const randomDailyAmount = Math.floor(Math.random() * (dailyAmountMax - dailyAmountMin + 1)) + dailyAmountMin;

      if (user) {
        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      user.balance += randomDailyAmount;
      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`> You recived **${randomDailyAmount}** <:Utility:1268981376401805404> | Come back in **${Math.round(cooldownRemaining / 3600000)}h. **`)
        .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /timely: ${error}`);
    }
  },
};
