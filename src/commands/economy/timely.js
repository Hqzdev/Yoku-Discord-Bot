const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

const dailyAmountMin = 500; 
const dailyAmountMax = 1500; 
const cooldownDuration = 28800000; 

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
          .setDescription(`> You can collect your reward in **${Math.round(cooldownRemaining / 28800000)}h.** `)
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

      // Проверка на наличие роли у пользователя
      const roleToMultiply = interaction.guild.roles.cache.find(role => role.id === '1011149070670237696' || role.id === '1011149306209771570'  || role.name === '1011148922032504893'); // Проверка на две роли
      let bonusAmount = randomDailyAmount; // Базовая сумма

      if (roleToMultiply && interaction.member.roles.cache.has(roleToMultiply.id)) {
        bonusAmount *= 3; // Умножаем сумму на 3, если у пользователя есть роль
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription(`> <:black_pontoMDE:1012702425481756693> You get: __${randomDailyAmount}__\n > Come back in **${Math.round(cooldownRemaining / cooldownDuration)}h.** <:clock:1283790032032759948>\n Wow! you have <@&${roleToMultiply.id}> Here's a **bonus** for you!\n <:economy:1283789921156333569> Multiplication: **x3** \n <:defcoin:1283789986386149377> Taking into account multiplication: **${bonusAmount}**`)
          .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');

        interaction.editReply({ embeds: [embed] });
        return;
      }

      // Сообщение для пользователя без бонуса
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`> You recived **${randomDailyAmount}** <:defcoin:1283789986386149377> | Come back in **${Math.round(cooldownRemaining / cooldownDuration)}h. **h. **`)
        .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /timely: ${error}`);
    }
  },
};
