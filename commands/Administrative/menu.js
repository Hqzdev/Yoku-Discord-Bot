const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder() // Объявляем `data` как свойство 
    .setName('menu')
    .setDescription('Sends a select menu'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Выберите чевхуй')
      .setDescription('Жопа хуй подмышки')
      .setColor(0x343434);

    const select = new StringSelectMenuBuilder() // Объявляем `select` внутри функции `execute`
      .setCustomId('starter')
      .setPlaceholder('Выберите вариант')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('мокс-лох')
          .setDescription('пися')
          .setValue('мокс-лох'),
        new StringSelectMenuOptionBuilder()
          .setLabel('хуева')
          .setDescription('член')
          .setValue('хуева'),
        new StringSelectMenuOptionBuilder()
          .setLabel('жопа')
          .setDescription('еблатя')
          .setValue('жопа'),
      );

    const row = new ActionRowBuilder()
      .addComponents(select);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    // Обработчик взаимодействия с меню
    const filter = i => i.customId === 'starter' && i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      let responseEmbed = new EmbedBuilder();

      switch (i.values[0]) {
        case 'мокс-лох':
          responseEmbed.setColor('#FF0000')
              .setTitle('Выбор: мокс-лох')
              .setDescription('Вы выбрали мокс-лох! Это замечательный выбор.');
          break;
        case 'хуева':
          responseEmbed.setColor('#00FF00')
              .setTitle('Выбор: хуева')
              .setDescription('Вы выбрали хуева! Прекрасный выбор.');
          break;
        case 'жопа':
          responseEmbed.setColor('#0000FF')
              .setTitle('Выбор: жопа')
              .setDescription('Вы выбрали жопа! Очень интересный выбор.');
          break;
      }

      await i.reply({ embeds: [responseEmbed], ephemeral: true }); // ephemeral: true делает ответ видимым только для этого пользователя
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp('Время выбора истекло!');
      }
    });
  },
};

