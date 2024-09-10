const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const canvacord = require('canvacord');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription("Check your level")
    .addMentionableOption((option) =>
      option.setName('target-user').setDescription('The user whose level you want to see.')
    ),

  async execute(interaction) {
    if (!interaction.inGuild()) {
      const embed = new EmbedBuilder().setColor('RED').setDescription('You can run this command only on the server.');
      return interaction.reply({ embeds: [embed] });
    }

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get('target-user')?.value;
    const targetUserId = mentionedUserId || interaction.member.id;

    try {
      const targetUserObj = await interaction.guild.members.fetch(targetUserId);
      const fetchedLevel = await Level.findOne({
        userId: targetUserId,
        guildId: interaction.guild.id,
      });

      if (!fetchedLevel) {
        const embed = new EmbedBuilder()
          .setColor('RED')
          .setDescription(
            mentionedUserId
              ? `${targetUserObj.user.tag} it does not have levels yet. Work more in the chat and try again.`
              : "You don't have levels yet. Chat more and try again."
          );
        return interaction.editReply({ embeds: [embed] });
      }

      let allLevels = await Level.find(
        { guildId: interaction.guild.id },
        { _id: 0, userId: 1, level: 1, xp: 1 }
      );

      // Сортируем уровни
      allLevels.sort((a, b) => {
        if (a.level === b.level) {
          return b.xp - a.xp;
        }
        return b.level - a.level;
      });

      const currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

      // Create a new instance of the Rank class
      const rank = new canvacord.Rank()
        .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
        .setRank(currentRank)
        .setLevel(fetchedLevel.level)
        .setCurrentXP(fetchedLevel.xp)
        .setRequiredXP(calculateLevelXp(fetchedLevel.level))
        .setStatus(targetUserObj.presence?.status || 'offline')
        .setProgressBar('#FFC300', 'COLOR')
        .setUsername(targetUserObj.user.username)
        .setDiscriminator(targetUserObj.user.discriminator);

      const data = await rank.build();
      const attachment = new AttachmentBuilder(data);

      const embed = new EmbedBuilder()
        .setColor('BLUE')
        .setImage('attachment://rank.png');

      return interaction.editReply({ embeds: [embed], files: [attachment] });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setColor('RED')
        .setDescription('An error occurred while processing your request.');
      return interaction.editReply({ embeds: [embed] });
    }
  },
};
