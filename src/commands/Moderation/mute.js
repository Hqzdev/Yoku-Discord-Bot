const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'mute',
  description: 'Mute a member in the server',
  options: [
    {
      name: 'user',
      description: 'Select a user to mute',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'duration',
      description: 'Duration of the mute (in minutes)',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for the mute',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:20943crossmark:1268557997349797899> | You can only run this command inside a server.')
        .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const targetUser = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = interaction.guild.members.cache.get(targetUser.id);

    // Проверка прав пользователя
    if (!interaction.member.permissions.has('MUTE_MEMBERS')) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('<:20943crossmark:1268557997349797899> | You do not have permission to mute members.');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Проверка наличия пользователя на сервере
    if (!member) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription(`<:20943crossmark:1268557997349797899> | Could not find user <@${targetUser.id}> in this server.`);
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Проверка, может ли бот замьютить этого пользователя
    if (!member.manageable) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription(`<:20943crossmark:1268557997349797899> | I cannot mute <@${targetUser.id}>.`);
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      await interaction.deferReply();

      // Применение мьюта с таймером
      await member.timeout(duration * 60 * 1000, reason);

      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`<:37667checkmark:1268558027364106416> | <@${targetUser.id}> was muted for **${duration}** minutes.\nReason: **${reason}**`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error muting user: ${error}`);
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('<:20943crossmark:1268557997349797899> | An error occurred while trying to mute this member.');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
