const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder,
} = require('discord.js');
const canvafy = require('canvafy');
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

    // Create a Canvafy object
    const canva = new canvafy();

    // Set the rank card data
    canva.setData({
      avatar: targetUserObj.user.displayAvatarURL({ size: 256 }),
      rank: currentRank,
      level: fetchedLevel.level,
      currentXp: fetchedLevel.xp,
      requiredXp: calculateLevelXp(fetchedLevel.level),
      status: targetUserObj.presence?.status || 'offline',
      username: targetUserObj.user.username,
      discriminator: targetUserObj.user.discriminator,
    });

    // Define a custom template for the rank card
    canva.setTemplate(`
      <div style="background-color: #2f3136; border-radius: 10px; padding: 20px; width: 700px;">
        <div style="display: flex; align-items: center;">
          <img src="{{avatar}}" style="width: 100px; height: 100px; border-radius: 50%;" />
          <div style="margin-left: 20px;">
            <h2 style="color: #ffffff; font-size: 30px;">Level: {{level}}</h2>
            <div style="background-color: #228B22; height: 20px; width: {{currentXp}}px; border-radius: 5px;"></div>
            <h3 style="color: #ffffff; font-size: 25px;">Rank: {{rank}}</h3>
            <h3 style="color: #ffffff; font-size: 25px;">{{username}}#{{discriminator}}</h3>
          </div>
        </div>
      </div>
    `);

    // Render the rank card to a buffer
    const buffer = await canva.render();

    // Create an attachment and send it
    const attachment = new AttachmentBuilder(buffer, { name: 'rank.png' });
    interaction.editReply({ files: [attachment] });
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
