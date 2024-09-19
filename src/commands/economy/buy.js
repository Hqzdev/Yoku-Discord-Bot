const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User'); // Модель для взаимодействия с базой данных

// Цены на роли
const rolePrices = {
  '1116043896280076339': 5,  
  '1020688223653077043': 5,
  '1116043993705369752': 5, 
  '1116043789274984559': 5, 
  '1116044069186060338': 5,  
  '1116044170612715653': 5,
};

module.exports = {
  name: 'buy',
  description: 'Purchase a role using your coins.',
  options: [
    {
      name: 'role',
      description: 'The role you want to buy',
      required: true,
      type: ApplicationCommandOptionType.Role, 
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const selectedRole = interaction.options.getRole('role'); // Получаем выбранную роль
    const roleId = selectedRole.id;

    // Проверяем, есть ли цена на данную роль
    if (!rolePrices[roleId]) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setTitle('Role Not Available')
        .setDescription('> This role is not available for purchase.\n > You can buy this role: <@&1020688223653077043> <@&1116043993705369752> <@&1020688223653077043> <@&1116043896280076339> <@&1116044170612715653> <@&1116044069186060338> ')
        .setTimestamp();
      await interaction.editReply({ embeds: [embed], ephemeral: true });
      return;
    }

    const rolePrice = rolePrices[roleId];

    // Ищем пользователя в базе данных
    const query = { userId: interaction.member.id, guildId: interaction.guild.id };
    let user = await User.findOne(query);

    if (!user) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setTitle('Profile Not Found')
        .setDescription('You do not have a user profile in the database.')
        .setTimestamp();
      await interaction.editReply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Проверяем, достаточно ли у пользователя монет
    if (user.default < rolePrice) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setTitle('Insufficient Coins')
        .setDescription(`You do not have enough coins. You need ${rolePrice - user.default} more coins to buy this role.`)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Проверяем, есть ли у пользователя уже эта роль
    if (interaction.member.roles.cache.has(roleId)) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setTitle('Role Already Owned')
        .setDescription('You already have this role.')
        .setTimestamp();
      await interaction.editReply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Проверка, может ли бот выдать эту роль (бот должен иметь роль выше выдаваемой)
    const botMember = interaction.guild.members.cache.get(client.user.id);
    if (botMember.roles.highest.position <= selectedRole.position) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setTitle('Permission Denied')
        .setDescription('I do not have the permissions to assign this role. Please ensure my role is higher than the role you are trying to buy.')
        .setTimestamp();
      await interaction.editReply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Вычитаем монеты и обновляем баланс
    user.premium -= rolePrice;
    await user.save();

    // Выдаем роль пользователю
    try {
      await interaction.member.roles.add(roleId);
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setTitle('Role Purchased')
        .setDescription(`You have successfully purchased the role <@&${selectedRole.id}> for **${rolePrice}** coins!`)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error assigning role:', error);
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setTitle('Role Assignment Failed')
        .setDescription('There was an error assigning the role. Please try again later.')
        .setTimestamp();
      await interaction.editReply({ embeds: [embed], ephemeral: true });

      // Возвращаем монеты пользователю, если роль не удалось выдать
      user.premium += rolePrice;
      await user.save();
    }
  },
};
