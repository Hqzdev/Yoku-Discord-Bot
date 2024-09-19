const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { devOnly } = require('../Moderation/clear');

module.exports = {
  name: 'unban',
  description: 'Unban a user from the server',
  devOnly: true,
  options: [
    {
      name: 'user_id',
      description: 'ID of the user to unban',
      type: 3, // Тип данных String для ID пользователя
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for the unban',
      type: 3, // Тип данных String для причины
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:20943crossmark:1268557997349797899> | You can only run this command inside a server.');

      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      await interaction.deferReply();

      const userId = interaction.options.getString('user_id');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      // Проверяем, забанен ли пользователь
      const banList = await interaction.guild.bans.fetch();
      const bannedUser = banList.get(userId);

      if (!bannedUser) {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription(`<:20943crossmark:1268557997349797899> | User with ID \`${userId}\` is not banned or does not exist.`);
        interaction.editReply({ embeds: [embed] });
        return;
      }

      // Разбаниваем пользователя
      await interaction.guild.members.unban(userId, reason);

      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`<:37667checkmark:1268558027364106416> | User with ID \`${userId}\` has been unbanned.\nReason: **${reason}**.`);
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /unban: ${error}`);
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`<:20943crossmark:1268557997349797899> | An error occurred while trying to unban the user with ID \`${userId}\`.`);
      interaction.editReply({ embeds: [embed] });
    }
  },
};
