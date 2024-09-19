const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User'); 

module.exports = {
  name: 'give',
  description: 'Give currency to another user!',
  options: [
    {
      name: 'user',
      description: 'Select a user to give currency to',
      type: 6, // Тип 6 - для выбора пользователя
      required: true,
    },
    {
      name: 'amount',
      description: 'How much currency do you want to give?',
      type: 4, // Тип 4 - целое число
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

      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');

      // Получаем данные отправителя
      let sender = await User.findOne({
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      });

      if (!sender || sender.balance < amount) {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription('You don\'t have enough currency to complete this transaction.')
          .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
        interaction.editReply({ embeds: [embed] });
        return;
      }

      // Получаем данные получателя
      let recipient = await User.findOne({
        userId: targetUser.id,
        guildId: interaction.guild.id,
      });

      if (!recipient) {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription(`<@${targetUser.id}> doesn't have a profile yet.`)
          .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
        interaction.editReply({ embeds: [embed] });
        return;
      }

      // Обновляем баланс отправителя и получателя
      sender.balance -= amount;
      recipient.balance += amount;

      await sender.save();
      await recipient.save();

      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`> You have successfully transferred **${amount}** coins to <@${targetUser.id}>.`)
        .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /give: ${error}`);
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('An error occurred while trying to complete the transaction.')
        .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      interaction.editReply({ embeds: [embed] });
    }
  },
};
