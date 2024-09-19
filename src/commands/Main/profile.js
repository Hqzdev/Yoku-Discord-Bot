const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  name: 'profile',
  description: 'Shows information about the user profile',
  callback: async (client, interaction) => {
    const member = interaction.member; // Текущий участник
    const user = interaction.user; // Пользователь
    const guild = interaction.guild;
    const channel = interaction.channel;

    // Получение количества сообщений в канале от данного участника
    const messages = await channel.messages.fetch({ limit: 100 });
    let messageCount = 0;
    messages.forEach(msg => {
      if (msg.author.id === member.id) {
        messageCount++;
      }
    });

    // Поиск пользователя в базе данных
    const query = {
      userId: interaction.member.id,
      guildId: interaction.guild.id,
    };

    let dbUser = await User.findOne(query).catch(err => {
      console.error('Error fetching user from database:', err);
      return null;
    });

    if (!dbUser) {
      await interaction.reply({ content: 'User profile not found in the database.', ephemeral: true });
      return;
    }

    // Создание первоначального эмбеда с информацией о пользователе
    const embed = new EmbedBuilder()
      .setTitle(`User Profile: <:7824member:1268590978768441437>${member.user.username}`)
      .setDescription(`<:poll:1268590630683017216> **Activity:** Sends ${messageCount} messages in this channel`)
      .setColor(0x343434)
      .setTimestamp()
      .setThumbnail(member.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL() });

    // Создание меню выбора для дополнительной информации
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('profile_menu')
      .setPlaceholder('Additional information')
      .addOptions([
        new StringSelectMenuOptionBuilder()
          .setLabel('Server information')
          .setDescription('Roles, messages')
          .setValue('server-info')
          .setEmoji('<:TFM_Giveaway:1011987457476141138>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Account information')
          .setDescription('Creation date, nickname, joining date')
          .setValue('account-info')
          .setEmoji('<:_10:1014565992581574796>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Balance')
          .setDescription('Default and Premium balance')
          .setValue('balance-info')
          .setEmoji('<:coin:1283789954249527356>')
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Ответ с эмбед и меню
    await interaction.reply({
      embeds: [embed],
      components: [row]
    });

    // Установка фильтра и создания коллектора для обработки меню
    const filter = i => i.customId === 'profile_menu' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    // Обработка выбора в меню
    collector.on('collect', async i => {
      let responseEmbed = new EmbedBuilder();

      switch (i.values[0]) {
        case 'server-info':
          responseEmbed.setColor('#303135')
            .setTitle(`Server Information: <:7824member:1268590978768441437>${member.user.username}`)
            .setDescription(`<:80156developer:1268557869008031889>Roles: ${member.roles.cache.map(role => `<@&${role.id}>`).join(', ')}`)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() });
          break;
        case 'account-info':
          responseEmbed.setColor('#303135')
            .setTitle(`Account Information: <:7824member:1268590978768441437>${member.user.username}`)
            .setDescription(`<:2927mod:1268557973161246812>Creation date: __${user.createdAt.toLocaleDateString()}__\n<:69022twitchpartner:1268594358886596638>Joining date to the server: __${member.joinedAt.toLocaleDateString()}__`)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() });
          break;
        case 'balance-info':
          responseEmbed.setColor('#303135')
            .setTitle(`Current user balance: <@${user.id}>`)
            .setDescription(`\n > Money: **${dbUser.default}**<:defcoin:1283789986386149377> \n > Premium money: **${dbUser.premium}** <:coin:1283789954249527356>`)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() });
          break;
      }

      await i.reply({ embeds: [responseEmbed], ephemeral: true });
    });

    // Обработка завершения времени действия коллектора
    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp({ content: 'Time for selection has expired!', ephemeral: true });
      }
    });
  },
};
