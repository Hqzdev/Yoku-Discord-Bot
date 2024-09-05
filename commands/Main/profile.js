const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Shows information about the profile'),

  async execute(interaction) {
    const member = interaction.member; // Get the user object
    const user = interaction.user; // Added the `user` object
    const guild = interaction.guild;
    const channel = interaction.channel; 

    const messages = await channel.messages.fetch({ limit: 100 });
    let messageCount = 0;
    messages.forEach(msg => {
      if (msg.author.id === member.id) {
        messageCount++;
      }
    });

    const embed = new EmbedBuilder()
      .setTitle(`User Profile: <:7824member:1268590978768441437>${member.user.username}`)
      .setDescription(`<:poll:1268590630683017216> **Activity:** Sends ${messageCount} messages in channel`)
      .setColor(0x343434)
      .setTimestamp()
      .setThumbnail(member.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL() }); 

    const select = new StringSelectMenuBuilder()
      .setCustomId('starter')
      .setPlaceholder('Additional information')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Server information')
          .setDescription('Roles, messages')
          .setValue('server-info')
          .setEmoji('<:news:1014565995798601968>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Account information')
          .setDescription('Creation date, nickname on the server, joining date')
          .setValue('account-info')
          .setEmoji('<:_10:1014565992581574796>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Level and status')
          .setDescription('Level, balance, gifts')
          .setValue('level-status')
          .setEmoji('<:partner:1014565993676292247>'),
      );

    const row = new ActionRowBuilder()
      .addComponents(select);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    const filter = i => i.customId === 'starter' && i.member.id === interaction.member.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      let responseEmbed = new EmbedBuilder();

      switch (i.values[0]) {
        case 'server-info':
  responseEmbed.setColor('#343434')
    .setTitle(`Server Information: <:7824member:1268590978768441437>${member.user.username}`)
    .setDescription(`<:80156developer:1268557869008031889>Roles: ${member.roles.cache.map(role => `<@&${role.id}>`).join(', ')}`)
    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() }); 
  break;
        case 'account-info':
          responseEmbed.setColor('#343434')
            .setTitle(`Account Information: <:7824member:1268590978768441437>${member.user.username}`)
            .setDescription(`<:2927mod:1268557973161246812>Creation date: __${user.createdAt.toLocaleDateString()}__\n<:69022twitchpartner:1268594358886596638>Joining date to the server: __${member.joinedAt.toLocaleDateString()}__`)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() }); 
          break;
        case 'level-status':
          responseEmbed.setColor('#343434')
            .setTitle(`Level and status: <:7824member:1268590978768441437>${member.user.username}`)
            .setDescription('<:20943crossmark:1268557997349797899>Level and economy system is **still under development**')
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() }); 
          break;
      }

      await i.reply({ embeds: [responseEmbed], ephemeral: true }); 
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp({ content: 'Time for selection has expired!', ephemeral: true}); 
      }
    });
  },
};

