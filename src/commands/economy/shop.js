const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require('discord.js');
const User = require('../../models/User');

module.exports = {
  name: 'shop',
  description: "Server's shop",
  disabled: false,

  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: false }); // Сообщение теперь будет невидимым

    const query = {
      userId: interaction.member.id,
      guildId: interaction.guild.id,
    };

    let user = await User.findOne(query).catch(err => {
      console.error('Error fetching user:', err);
      return null; // Handle situation if user is not found or error occurs
    });

    if (!user) {
      await interaction.editReply({ content: 'You do not have a user profile in the database.'});
      return;
    }

    // Создание селект-меню с опциями для разделов
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('shop-menu')
      .setPlaceholder('Select a category from the shop')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Roles')
          .setDescription('Buy roles with premium coins')
          .setValue('roles')
          .setEmoji('<:TFM_Giveaway:1011987457476141138>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Temporary roles')
          .setDescription('Buy temporary roles')
          .setValue('temporary-roles')
          .setEmoji('<:clock:1283790032032759948> '),
        new StringSelectMenuOptionBuilder()
          .setLabel('Auto-workers')
          .setDescription('Auto-workers section (not available)')
          .setValue('auto-workers')
          .setEmoji('<:economy:1283789921156333569> '),
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Создание первоначального эмбеда с инструкцией
    const embed = new EmbedBuilder()
      .setColor('#303135')
      .setTitle('Role Store')
      .setDescription(`<:TFM_Giveaway:1011987457476141138> - **Roles**\nRegular roles with unlimited duration\n\n<:clock:1283790032032759948> - **Temporary roles**\nRoles with limited duration. More privileges!\n\n<:economy:1283789921156333569> - **Auto workers**\nAutomatic currency earnings using roles.\n\n**Money:** __${user.default}__ <:defcoin:1283789986386149377>\n**Premium money:** __${user.premium}__ <:coin:1283789954249527356>`)
      .setTimestamp()

    // Отправка эмбеда с меню
    await interaction.editReply({ embeds: [embed], components: [row] });

    // Обработка выбора из меню
    const filter = i => i.customId === 'shop-menu' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      let responseEmbed = new EmbedBuilder()
        .setColor('#303135')

      switch (i.values[0]) {
        case 'roles':
          responseEmbed
            .setTitle('Roles')
            .setDescription('**Prices:**\n<@&1020688223653077043>, <@&1116043993705369752>, <@&1020688223653077043>, <@&1116043896280076339>, <@&1116044170612715653>, <@&1116044069186060338> - **5 premium coins**');
          break;
        case 'temporary-roles':
          responseEmbed
            .setTitle('Temporary Roles')
            .setDescription('**Prices:**\n <@&1014204406553641170> - `50`\n <@&1014203638509473834> - `75`\n <@&1014203904575148052> - `100`');
          break;
        case 'auto-workers':
          responseEmbed
            .setTitle('Auto-workers')
            .setDescription('Not available yet');
          break;
      }

      await i.update({ embeds: [responseEmbed], components: [row] });
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp({ content: 'Time expired, please try again.', ephemeral: true });
      }
    });
  },
};
