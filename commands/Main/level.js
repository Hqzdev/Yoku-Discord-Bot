const { Client, Interaction, AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const calculateLevelXp = require('C:/Users/wkeyq/OneDrive/Рабочий стол/Yoku/events/calculateLevelXp');
const Level = require('C:/Users/wkeyq/OneDrive/Рабочий стол/Yoku/models/Level');
const { RankCard } = require("rankcard"); 
const { createCanvas, loadImage } = require('canvas'); 
const fs = require('fs');
const canvafy = require("canvafy"); // Make sure you've installed canvafy
// Путь к фоновому изображению

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription("Shows your/someone's level.")
    .addMentionableOption(option =>
      option.setName('target-user')
        .setDescription('The user whose level you want to see.')
    ),
  
  async execute(interaction) {
    if (!interaction.inGuild()) {
      await interaction.reply('You can only run this command inside a server.');
      return;
    }

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get('target-user')?.value;
    const targetUserId = mentionedUserId || interaction.member.id;

    try {
      const fetchedLevel = await Level.findOne({
        userId: targetUserId,
        guildId: interaction.guild.id,
      });

      if (!fetchedLevel) {
        await interaction.editReply(
          mentionedUserId
            ? `${interaction.guild.members.cache.get(targetUserId).user.tag} doesn't have any levels yet. Try again when they chat a little more.`
            : "You don't have any levels yet. Chat a little more and try again."
        );
        return;
      }

      const rank = await new canvafy.Rank()
      .setAvatar(interaction.member.displayAvatarURL({ forceStatic: true, extension: "png" })) // Use interaction.member
      .setBackground("image", "https://cdn.discordapp.com/attachments/1014116819667259442/1274363803555070113/8f514cebe8af4c164024414070bc3949.jpg?ex=66c3f587&is=66c2a407&hm=8b1baaff01df618e8b23aca32e32c4f837ca01ecb17656f9ccfd23448857648d&")
      .setUsername(interaction.member.user.username) // Use interaction.member.user
      .setBorder("#fff")
      .setStatus(interaction.member.presence?.status || "online")
      .setLevel(fetchedLevel.level) 
      .setRank(await Level.find({ guildId: interaction.guild.id }).where('userId').ne(targetUserId).countDocuments() + 1)
      .setCurrentXp(fetchedLevel.xp) 
      .setRequiredXp(calculateLevelXp(fetchedLevel.level))
      .build();
      // Преобразуем Rank в Buffer
      const buffer = await rank.toBuffer(); // Use the correct variable

      // Создаем AttachmentBuilder с Buffer
      const attachment = new AttachmentBuilder(buffer, { name: "rankcard.png" }); 

      // Отправляем изображение
      await interaction.editReply({ content: 'Here is your rank card:', files: [attachment] });

    } catch (error) {
      console.error('Error fetching level data or creating rank card:', error);
      await interaction.editReply('There was an error trying to fetch the level data.');
    }
  },
};

