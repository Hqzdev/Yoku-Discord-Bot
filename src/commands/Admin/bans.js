const { Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'bans',
  description: 'Check all banned users on the server',
  devOnly: true,
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

      // Получаем список всех банов на сервере
      const banList = await interaction.guild.bans.fetch();

      if (banList.size === 0) {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription('<:37667checkmark:1268558027364106416> | There are no banned users on this server.');
        interaction.editReply({ embeds: [embed] });
        return;
      }

      // Формируем список забаненных пользователей
      const banListDescription = banList.map(ban => `• **${ban.user.tag}** (ID: ${ban.user.id})`).join('\n');

      const embed = new EmbedBuilder()
        .setTitle('Banned Users')
        .setDescription(`Here is the list of banned users on the server:\n\n${banListDescription}`)
        .setColor('#303135');

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /bans: ${error}`);
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:20943crossmark:1268557997349797899> | An error occurred while fetching the ban list.');
      interaction.editReply({ embeds: [embed] });
    }
  },
};
