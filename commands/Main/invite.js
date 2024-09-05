const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('invite Yoku'),

  async execute(interaction) {
    const guild = interaction.guild;
    const client = interaction.client;
    const embed = new EmbedBuilder()
      .setColor(0x343434) 
      .setDescription('<:22915developer:1268595567668494356>__Yoku__ is it under development and **not yet available for use**.\n<:80156developer:1268557869008031889>But you can join in **support server** and check news.')
      .setAuthor({ name: `Yoku`, iconURL: 'https://cdn.discordapp.com/attachments/1014116819667259442/1268179735050190889/IMG_20240731_171318_881.jpg?ex=66ab7bea&is=66aa2a6a&hm=896e072e4a5de221d567d2ca4593fd6c1e7c8fa15e249ed77d545f86572afc2c&' })
      .setTimestamp()
      .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL() });
      const button = new ButtonBuilder()
      .setLabel('Support server')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/Z4JepuG8SJ')
      .setEmoji('<:link:1014565996624887809>');

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row] }); // Исправленный вызов await interaction.reply
  },
};

