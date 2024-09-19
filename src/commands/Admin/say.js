const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'say',
  description: 'Write a message in embed style on behalf of a bot',
  devOnly: true,
  options: [
    {
      name: 'color',
      description: 'Set the embed color in HEX format (e.g., #FF5733)',
      type: 3,
      required: true,
    },
    {
      name: 'text',
      description: 'The text that will be in the Yoku\'s message',
      type: 3,
      required: true
    },
],

callback: async (client, interaction) => {
  await interaction.deferReply();


    // Получаем значения из опций команды
    const color = interaction.options.getString('color');
    const text = interaction.options.getString('text');

    // Проверка правильности цвета
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      await interaction.editReply({
        content: 'Invalid hex color code. Please try again with a correct one (e.g., #FF5733).',
        ephemeral: true,
      });
      return;
    }

    // Создание эмбеда
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle('Message from Yoku')
      .setDescription(text)
      .setTimestamp();

    // Отправляем ответ с эмбед-сообщением
    await interaction.editReply({ embeds: [embed] });
  },
};
