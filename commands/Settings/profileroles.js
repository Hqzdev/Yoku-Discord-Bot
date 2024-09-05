const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, PermissionsBitField, Role } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleadd')
    .setDescription('Set a profile system')
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
        .setTitle('Profile customization')
        .setDescription('Choose the color of your nickname from the menu below!')
        .setColor('#343434')
        .setTimestamp()
        .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() });

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('option_select')
        .setPlaceholder('Choose color')
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel('White nick')
            .setValue('white')
            .setDescription('Set white nickname')
            .setEmoji('<:37667checkmark:1268558027364106416>'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Green nick')
            .setValue('green')
            .setDescription('Set green nickname')
            .setEmoji('<:37667checkmark:1268558027364106416>'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Red nick')
            .setValue('red')
            .setDescription('Set red nickname')
            .setEmoji(':WingsRed: '), // Assuming :WingsRed: is a valid emoji
          new StringSelectMenuOptionBuilder()
            .setLabel('Blue nick')
            .setValue('blue')
            .setDescription('Set blue nickname')
            .setEmoji('<:37667checkmark:1268558027364106416>'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Reset all colors')
            .setValue('reset')
            .setDescription('Remove all color roles')
            .setEmoji('<:37667checkmark:1268558027364106416>')
        );

      const menuRow = new ActionRowBuilder().addComponents(selectMenu);

      await i.editReply({ embeds: [selectEmbed], components: [menuRow], ephemeral: false });

      // Step 3: Handle Select Menu Interaction
      const menuFilter = (m) => m.customId === 'option_select' && m.user.id === interaction.member.id;
      const menuCollector = interaction.channel.createMessageComponentCollector({ filter: menuFilter, time: 15000 });

      menuCollector.on('collect', async m => {
        await m.deferUpdate();

        const chosenColor = m.values[0];
        const responseEmbed = new EmbedBuilder();

        // Find existing color roles
        let whiteRole = guild.roles.cache.find(role => role.name.toLowerCase() === 'white');
        let greenRole = guild.roles.cache.find(role => role.name.toLowerCase() === 'green');
        let redRole = guild.roles.cache.find(role => role.name.toLowerCase() === 'red');
        let blueRole = guild.roles.cache.find(role => role.name.toLowerCase() === 'blue');

        // If roles don't exist, create them

        switch (chosenColor) {
          case 'white':
            await member.roles.add(whiteRole);
            responseEmbed.setColor('#303135')
            .setTitle('Succesfully!')
              .setDescription(`Blue white was added`);
            break;
          case 'green':
            await member.roles.add(greenRole);
            responseEmbed.setColor('#303135')
            .setTitle('Succesfully!')
              .setDescription(`Blue green was added`);
            break;
          case 'red':
            await member.roles.add(redRole);
            responseEmbed.setColor('#303135')
            .setTitle('Succesfully!')
              .setDescription(`Blue red was added`);
            break;
          case 'blue':
            await member.roles.add(blueRole);
            responseEmbed.setColor('#303135')
            .setTitle('Succesfully!')
              .setDescription(`Blue color was added`);
            break;
          case 'reset':
            await member.roles.remove([whiteRole, greenRole, redRole, blueRole]);
            responseEmbed.setColor('#303135')
              .setTitle('Succesfully!')
              .setDescription(`All color was removed`);
            break;
        }

        await m.editReply({ embeds: [responseEmbed] });
      });

      menuCollector.on('end', collected => {
        if (collected.size === 0) {
          interaction.followUp({ content: 'Time for selection has expired!', ephemeral: true });
        }
      });
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp({ content: 'Time for selection has expired!', ephemeral: true });
      }
    });
  },
};
