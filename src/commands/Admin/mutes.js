const { Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'mutes',
  description: 'Check all muted users on the server',
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
      const muteList = await interaction.guild.mute.fetch();

      if (banList.size === 0) {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription('<:37667checkmark:1268558027364106416> | There are no muted users on this server.');
        interaction.editReply({ embeds: [embed] });
        return;
      }

      // Формируем список забаненных пользователей
      const muteListDescription = muteList.map(mute => `• **${mute.user.tag}** (ID: ${mute.user.id})`).join('\n');

      const embed = new EmbedBuilder()
        .setTitle('muted Users')
        .setDescription(`Here is the list of muted users on the server:\n\n${muteListDescription}`)
        .setColor('#303135');

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /mutes: ${error}`);
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:20943crossmark:1268557997349797899> | An error occurred while fetching the mute list.');
      interaction.editReply({ embeds: [embed] });
    }
  },
};
