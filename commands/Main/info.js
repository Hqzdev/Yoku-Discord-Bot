const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('info about Yoku'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x343434) 
      .setDescription('Yoku is a **multi-functional bot** designed to enhance your __Discord server__.')
      .setAuthor({ name: 'Yoku', iconURL: 'https://cdn.discordapp.com/attachments/1014116819667259442/1268179735050190889/IMG_20240731_171318_881.jpg?ex=66ab7bea&is=66aa2a6a&hm=896e072e4a5de221d567d2ca4593fd6c1e7c8fa15e249ed77d545f86572afc2c&' })
      .addFields(
        { name: '<:80156developer:1268557869008031889>**Assembly information**', value:'Version: ``1.0``\nDate of creation: ``28.07.24``', inline: true },
        { name: '<:2927mod:1268557973161246812>**Support server**', value: '[Harmony](https://discord.gg/Z4JepuG8SJ)🌙', inline: true },
        { name: '<:22915developer:1268595567668494356>**Developer**', value: '1.``Haqz.dev\n``(1113473145538613350)', inline: false },
      )
      .setTimestamp()
      .setFooter({ text: ' ', iconURL: 'https://example.com/icon.png' }); // Исправленный вызов setFooter

    const button = new ButtonBuilder()
      .setCustomId('disabled')
      .setLabel('Invite Yoku')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('<:20943crossmark:1268557997349797899>')
      .setDisabled(true);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row] }); // Исправленный вызов await interaction.reply
  },
};
