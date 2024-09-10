const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verif')
    .setDescription('Set a verification system')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator), // Only admins can use this command

  async execute(interaction) {
    const member = interaction.member;
    const guild = interaction.guild;

    // Step 1: Initial Message with Button
    const initialEmbed = new EmbedBuilder()
      .setTitle('Set a verification system')
      .setDescription('Click the button to continue.')
      .setColor('#343434')
      .setTimestamp()
      .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() });

    const button = new ButtonBuilder()
      .setCustomId('next_button')
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('<:emoji_144:1268993835778707550>');

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [initialEmbed], components: [row] });

    // Step 2: Handle Button Click
    const filter = i => i.customId === 'next_button' && i.member.id === interaction.member.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      await i.deferReply({ ephemeral: false });

      // Step 2: Message with Select Menu
      const selectEmbed = new EmbedBuilder()
        .setTitle('Select an Option')
        .setDescription('<:emoji_19:1011524159702048819>**Верификация** Добро пожаловать на верификацию нашего сервера **Harmony**🌙 . Для начала читаем правила а потом нажимаем на кнопку из списка и проходим верификацию\n\n\nUpd:<:22915developer:1268595567668494356>Чтобы вас не беспокоили пинги @everyone то возьмите пару ролей в канале <#1010975495275429978> и наслаждайтесь\nhttps://media.discordapp.net/attachments/1010983537643630612/1113011132693762178/standard.gif?ex=66c59be4&is=66c44a64&hm=09b2b4654beeb4d83e03970e70799a7cb0fa380d793efcb25a1cfe25893ab66d&')
        .setColor('#343434')
        .setTimestamp()
        .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() });

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('option_select')
        .setPlaceholder('Select the desired one')
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel('Pass the verification')
            .setValue('option2')
            .setDescription('get faccess to the server')
            .setEmoji('<:37667checkmark:1268558027364106416>')
        );

      const menuRow = new ActionRowBuilder().addComponents(selectMenu);

      await i.editReply({ embeds: [selectEmbed], components: [menuRow], ephemeral: false });
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp({ content: 'Time for selection has expired!', ephemeral: true });
      }
    });

    // Step 3: Handle Select Menu Interaction (inside the collector.on('collect'))
    const menuFilter = (m) => m.customId === 'option_select' && m.user.id === interaction.user.id;
    const menuCollector = interaction.channel.createMessageComponentCollector({ filter: menuFilter, time: 15000 });

    menuCollector.on('collect', async m => {
      await m.deferUpdate();

      // Step 3: Message based on Select Menu Choice
      const resultEmbed = new EmbedBuilder()
        .setTitle('Changing Member Roles... ')
        .setDescription(`
The following roles were removed: <@1011148677781397505>\nThe following roles were added: <@1010986193028141099>`)
        .setColor('#343434')
        .setTimestamp();

      // Add role
      const roleToRemove = guild.roles.cache.get('1011148677781397505'); // Replace with the role ID to remove
      const roleToGive = guild.roles.cache.get('1010986193028141099'); // Replace with the role ID to give
      await m.member.roles.add(roleToGive); // Use m.member instead of interaction.member
      await m.member.roles.remove(roleToRemove); // Use m.member instead of interaction.member

      await m.followUp({ embeds: [resultEmbed], ephemeral: true });
    });

    menuCollector.on('end', collected => {
      if (collected.size === 0) {
        m.followUp({ content: 'Time for selection has expired!', ephemeral: true });
      }
    });
  },
};
