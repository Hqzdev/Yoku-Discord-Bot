const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutes a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to mute')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for mute')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    // Проверка разрешений бота
    const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
    if (!botMember.permissions.has('ModerateMembers')) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ | Я не имею разрешения на мутацию пользователей.')],
        ephemeral: true
      });
    }

    // Проверка разрешений пользователя
    if (!interaction.member.permissions.has('ModerateMembers')) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('❌ | У вас нет разрешений на мутацию пользователей.')],
        ephemeral: true
      });
    }

    // Варианты времени для выбора
    const timeOptions = [
      { label: '1 Minute', value: '60' },
      { label: '5 Minutes', value: '300' },
      { label: '10 Minutes', value: '600' },
      { label: '30 Minutes', value: '1800' },
      { label: '1 Hour', value: '3600' },
      { label: '12 Hours', value: '43200' },
      { label: '1 Day', value: '86400' },
      { label: '1 Week', value: '604800' }
    ];

    const timeSelect = new StringSelectMenuBuilder()
      .setCustomId('mute_time')
      .setPlaceholder('Select Duration')
      .addOptions(timeOptions.map(option => 
        new StringSelectMenuOptionBuilder()
          .setLabel(option.label)
          .setValue(option.value)
      ));

    const confirm = new ButtonBuilder()
      .setCustomId('confirm_mute')
      .setLabel('Confirm Mute')
      .setStyle(ButtonStyle.Secondary);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel_mute')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    const timeRow = new ActionRowBuilder().addComponents(timeSelect);
    const buttonRow = new ActionRowBuilder().addComponents(cancel, confirm);

    const embedPrompt = new EmbedBuilder()
      .setColor('#343434')
      .setDescription(`❓ | Are you sure you want to mute ${target} for reason: **${reason}**`);

    await interaction.reply({
      embeds: [embedPrompt],
      components: [timeRow, buttonRow],
    });

    // Фильтр для взаимодействий (только для инициатора команды)
    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (i) => {
      if (i.customId === 'confirm_mute') {
        const selectedTime = i.values[0];  // Получаем значение длительности
        const muteDuration = parseInt(selectedTime);

        try {
          await interaction.guild.members.timeout(target.id, muteDuration * 1000, reason);
          const embedSuccess = new EmbedBuilder()
            .setColor('#343434')
            .setDescription(`✅ | ${target} has been muted for ${muteDuration / 60} minutes.`);
          await i.update({ embeds: [embedSuccess], components: [] });
        } catch (error) {
          console.error(error);
          const embedError = new EmbedBuilder()
            .setColor('#343434')
            .setDescription(`❌ | Error: Could not mute ${target}.`);
            
          await i.update({ embeds: [embedError], components: [] });
        }
      } else if (i.customId === 'cancel_mute') {
        const embedCancel = new EmbedBuilder()
          .setColor('#343434')
          .setDescription(`❌ | Mute canceled.`);
        await i.update({ embeds: [embedCancel], components: [] });
      }
    });

    collector.on('end', collected => {
      console.log(`Collected ${collected.size} interactions.`);
    });
  },
};

