const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  name: 'leaderboard',
  description: 'Display the top users by balance (regular and premium currency).',
  
  callback: async (client, interaction) => {
    await interaction.deferReply();

    // Получаем всех пользователей из базы данных
    let users = await User.find({ guildId: interaction.guild.id }).catch(err => {
      console.error('Error fetching users:', err);
      return [];
    });

    if (users.length === 0) {
      const noDataEmbed = new EmbedBuilder()
        .setColor('#303135')
        .setTitle('No Users Found')
        .setDescription('There are no users with recorded balances in the database.')
        .setTimestamp();
      await interaction.editReply({ embeds: [noDataEmbed], ephemeral: true });
      return;
    }

    // Сортируем пользователей по обычной валюте (default)
    let regularLeaderboard = [...users].sort((a, b) => b.default - a.default).slice(0, 10);
    // Сортируем пользователей по премиум валюте (premium)
    let premiumLeaderboard = [...users].sort((a, b) => b.premium - a.premium).slice(0, 10);

    // Формируем строку для отображения топа по обычной валюте
    let regularLeaderboardString = '';
    regularLeaderboard.forEach((user, index) => {
      regularLeaderboardString += `**${index + 1}.** <@${user.userId}> - ${user.default} coins\n`;
    });

    // Формируем строку для отображения топа по премиум валюте
    let premiumLeaderboardString = '';
    premiumLeaderboard.forEach((user, index) => {
      premiumLeaderboardString += `**${index + 1}.** <@${user.userId}> - ${user.premium} premium coins\n`;
    });

    // Создаем эмбед
    const embed = new EmbedBuilder()
      .setColor('#303135')
      .setTitle('🏆 Leaderboard')
      .addFields(
        { name: 'Top Users by Regular Currency', value: regularLeaderboardString || 'No data available', inline: false },
        { name: 'Top Users by Premium Currency', value: premiumLeaderboardString || 'No data available', inline: false }
      )
      .setTimestamp()
      .setFooter({ text: 'Harmony Server', iconURL: interaction.guild.iconURL() });

    // Отправляем сообщение
    await interaction.editReply({ embeds: [embed] });
  },
};
