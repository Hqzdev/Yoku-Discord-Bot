const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('navigation')
    .setDescription('Navigating the server'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Server Information')
      .setDescription('Choose a section to learn more about our server.')
      .setColor(0x303135);

    const select = new StringSelectMenuBuilder()
      .setCustomId('starter')
      .setPlaceholder('Select a section')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Rules')
          .setDescription('Check our server rules (read carefully)')
          .setValue('rules')
          .setEmoji('<:announce:1014565998390689792>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Roles')
          .setDescription('Check information about server roles')
          .setValue('roles')
          .setEmoji('<:poll:1268590630683017216>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Channels')
          .setDescription('Check information about server channels')
          .setValue('channels')
          .setEmoji('<:news:1014565995798601968>')
      );

    const row = new ActionRowBuilder()
      .addComponents(select);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    const filter = i => i.customId === 'starter' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      let responseEmbed = new EmbedBuilder();

      switch (i.values[0]) {
        case 'rules':
          // Define your embeds here
          const embeds = [
            new EmbedBuilder()
              .setTitle('Пункт 1.1')
              .setDescription("> **Описание:**\n```Запрещается дискриминация по любому признаку — расовому, национальному, гражданскому, половому, религиозному, возрастному, по инвалидности, роду занятий или сексуальной ориентации```\n<:black_pontoMDE:1012702425481756693>**Наказание:**\n```Предупреждение/Мут```\n\n<:black_pontoMDE:1012702425481756693>**Длительность:**\n ```Мут на 2 часа")
              .setColor('#303135'),
            new EmbedBuilder()
              .setTitle('Пункт 1.2')
              .setDescription('> **Описание:**\n```Запрещается любая форма рекламы магазинов, товаров и прочих услуг. А также запрещена любая коммерческая деятельность без разрешения высшей администрации```\n\n**Наказание:**\n```Бан```\n\n<:black_pontoMDE:1012702425481756693>**Длительность:**\n```Бан навсегда```') // Add your description here
              .setColor('#303135'),
            new EmbedBuilder()
              .setTitle('Пункт 1.3')
              .setDescription('> **Описание:**\n```Запрещается публикация материалов грубого, насильственного характера, жестокости, призывы к таковым, сообщения экстремистского толка.\n\n**<:black_pontoMDE:1012702425481756693>Наказание:**\n```Бан/Мут```\n\n<:black_pontoMDE:1012702425481756693>**Длительность:**\n```Мут на 12 часов/Бан навсегдa```') // Add your description here
              .setColor('#303135'),
            new EmbedBuilder()
              .setTitle('Пункт 1.4')
              .setDescription('> **Описание:**\n```Запрещается разглашение чьей бы то ни было персональной информации. Это относится как к собственным данным, так и полученным от других пользователей посредством приватной части форума и прочих средств коммуникации (например, такой как адреса, телефоны, email, финансовых данных, перепост личных фото форумчан, профилей в соцсетях и пр.).\n\n**<:black_pontoMDE:1012702425481756693>Наказание:**\n```Предупреждение/Мут```\n\n<:black_pontoMDE:1012702425481756693>**Длительность:**```Мут на 6 часов/Бан навсегда```') // Add your description here
              .setColor('#303135'),
            new EmbedBuilder()
              .setTitle('Пункт 1.5')
              .setDescription('> **Описание:**\n```Запрещается спам и флуд. В частности, запрещено отправлять одинаковые сообщения, массово публиковать ссылки, прикреплять изображения. \n\n<:black_pontoMDE:1012702425481756693>**Наказание:**\n```Предупреждение/Мут/Бан```\n\n<:black_pontoMDE:1012702425481756693>**Длительность:**```Мут на 3 часа/Бан навсегда```') // Add your description here
              .setColor('#303135'),
            new EmbedBuilder()
              .setTitle('Пункт 1.6')
              .setDescription('> **Описание:**\n```Запрещается использовать нецензурную лексику, оскорблять и унижать других пользователей. Запрещается также провоцировать конфликты, распространять дезинформацию, писать в чате на нерусском языке. \n\n<:black_pontoMDE:1012702425481756693>**Наказание:**\n```Предупреждение/Мут/Бан```\n\n<:black_pontoMDE:1012702425481756693>**Длительность:**```Мут на 3 часа/Бан навсегда```') // Add your description here
              .setColor('#303135'),
          ];

          await i.reply({ embeds: embeds, ephemeral: true });
          break;

        case 'roles':
          responseEmbed.setColor('#303135')
            .setTitle('Server Roles')
            .setDescription('Information about roles will be here.'); // Replace with actual role info
          await i.reply({ embeds: [responseEmbed], ephemeral: true });
          break;
        case 'channels':
          responseEmbed.setColor('#303135')
            .setTitle('Server Channels')
            .setDescription('Information about channels will be here.'); // Replace with actual channel info
          await i.reply({ embeds: [responseEmbed], ephemeral: true });
          break;
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp('Time for selection has expired!');
      }
    });
  },
};
