const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require('discord.js');
const canvacord = require("canvacord");
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply('You can only run this command inside a server.');
      return;
    }

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get('target-user')?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
          : "You don't have any levels yet. Chat a little more and try again."
      );
      return;
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      '-_id userId level xp'
    );

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    const img = targetUserObj.user.displayAvatarURL({ format: 'png', size: 256 });
    const background = "https://i.imgur.com/5O7xmVe.png";
    
    // Данные для отображения уровня
    const userData = {
      xp: fetchedLevel.xp,
      requiredXP: calculateLevelXp(fetchedLevel.level),
      rank: currentRank,
      level: fetchedLevel.level,
    };

    const rank = new canvacord.Rank()
      .setAvatar(img)
      .setBackground('IMAGE', background)
      .setCurrentXP(userData.xp)
      .setRequiredXP(userData.requiredXP)
      .setRank(userData.rank)
      .setRankColor("#FFFFFF")
      .setLevel(userData.level)
      .setLevelColor("#FFFFFF")
      .setStatus("online", true)
      .setCustomStatusColor("#23272A")
      .setOverlay("#23272A", 0, true)
      .setProgressBar(["#FF0000", "#0000FF"], "GRADIENT")
      .setProgressBarTrack("#000000")
      .setUsername(targetUserObj.user.username)
      .setDiscriminator(targetUserObj.user.discriminator)
      .renderEmojis(true);

    rank.build().then(data => {
      const attachment = new AttachmentBuilder(data, { name: 'RankCard.png' });
      interaction.editReply({ files: [attachment] });
    }).catch(err => {
      console.error(err);
      interaction.editReply('There was an error generating the rank card.');
    });
  },

  name: 'level',
  description: "Shows your/someone's level.",
  options: [
    {
      name: 'target-user',
      description: 'The user whose level you want to see.',
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
