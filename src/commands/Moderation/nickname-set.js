const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'set-nickname',
  description: 'Set a nickname for a member',
  options: [
    {
      name: 'user',
      description: 'Select a user to set nickname for',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'nickname',
      description: 'The new nickname to set for the user',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for changing the nickname',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('You can only run this command inside a server.');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const targetUser = interaction.options.getUser('user');
    const newNickname = interaction.options.getString('nickname');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(targetUser.id);


    if (!interaction.member.permissions.has('MANAGE_NICKNAMES')) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:20943crossmark:1268557997349797899> | You do not have permission to manage nicknames.');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }


    if (!member.manageable) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`<:20943crossmark:1268557997349797899> | I cannot manage the nickname of <@${targetUser.id}>.`);
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      await interaction.deferReply();

      // Установка нового никнейма
      await member.setNickname(newNickname, reason);

      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`<:37667checkmark:1268558027364106416> |  The nickname for <@${targetUser.id}> has been set to **${newNickname}**.\nReason: **${reason}**`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error setting nickname: ${error}`);
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:20943crossmark:1268557997349797899> | An error occurred while trying to set the nickname.');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
