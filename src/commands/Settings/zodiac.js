const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, PermissionsBitField, Role } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zodiac')
    .setDescription('Set a zodiac system')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator), // Only admins can use this command

  async execute(interaction) {
    const member = interaction.member;
    const guild = interaction.guild;

    // Step 1: Initial Message with Button
    const initialEmbed = new EmbedBuilder()
      .setTitle('🌠 Set a zodiac system 🌠')
      .setDescription('Click the button to continue.')
      .setColor('#343434')
      .setTimestamp()
      .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() });

    const button = new ButtonBuilder()
      .setCustomId('next_button')
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('➡️');

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [initialEmbed], components: [row] });

    // Step 2: Handle Button Click
    const filter = i => i.customId === 'next_button' && i.member.id === interaction.member.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      await i.deferReply({ ephemeral: false });

      // Step 2: Message with Select Menu
      const selectEmbed = new EmbedBuilder()
        .setTitle('💫 Roles of the zodiac sign 💫')
        .setDescription('Get the roles of the zodiac sign that you are interested in. To do this, select roles from the list under this message.')
        .setColor('#343434')
        .setImage('https://media.discordapp.net/attachments/1014116819667259442/1114468611780784158/InShot_20230601_210530350.jpg?ex=66de0706&is=66dcb586&hm=2dd2199c9466aaf2e13089023f7c7ba612d1f3972b93eba5f1c941444a55f6bd&=&format=webp&width=1440&height=20');

      // Create a select menu with options for each zodiac sign
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('zodiac_select')
        .setPlaceholder('Choose a zodiac sign')
        .addOptions([
          new StringSelectMenuOptionBuilder().setLabel('♈ Aries').setValue('aries').setDescription('The first sign of the zodiac'),
          new StringSelectMenuOptionBuilder().setLabel('♉ Taurus').setValue('taurus').setDescription('The second sign of the zodiac'),
          new StringSelectMenuOptionBuilder().setLabel('♊ Gemini').setValue('gemini').setDescription('The third sign of the zodiac'),
          new StringSelectMenuOptionBuilder().setLabel('♋ Cancer').setValue('cancer').setDescription('The fourth sign of the zodiac'),
          new StringSelectMenuOptionBuilder().setLabel('♌ Leo').setValue('leo').setDescription('The fifth sign of the zodiac'),
          new StringSelectMenuOptionBuilder().setLabel('♍ Virgo').setValue('virgo').setDescription('The sixth sign of the zodiac'),
          new StringSelectMenuOptionBuilder().setLabel('♎ Libra').setValue('libra').setDescription('The seventh sign of the zodiac'),
          new StringSelectMenuOptionBuilder().setLabel('♏ Scorpio').setValue('scorpio').setDescription('The eighth sign of the zodiac'),
          new StringSelectMenuOptionBuilder().setLabel('♐ Sagittarius').setValue('sagittarius').setDescription('The ninth sign of the zodiac'),
          new StringSelectMenuOptionBuilder().setLabel('♑ Capricorn').setValue('capricorn').setDescription('The tenth sign of the zodiac'),
          new StringSelectMenuOptionBuilder().setLabel('♒ Aquarius').setValue('aquarius').setDescription('The eleventh sign of the zodiac'),
          new StringSelectMenuOptionBuilder().setLabel('♓ Pisces').setValue('pisces').setDescription('The twelfth sign of the zodiac'),
        ]);

    
      // Create the action row
      const row = new ActionRowBuilder().addComponents(selectMenu);

      // Send the message with the select menu
      await i.editReply({ embeds: [selectEmbed], components: [row] });

      // Step 3: Handle Select Menu Interaction
      const selectCollector = i.channel.createMessageComponentCollector({ filter: i => i.customId === 'zodiac_select' && i.member.id === interaction.member.id, time: 15000 });

      selectCollector.on('collect', async i => {
        await i.deferReply({ ephemeral: true });

        const selectedZodiac = i.values[0]; // Get the selected value

        // Get the role ID from the selected option
        const roleId = i.component.options.find(option => option.value === selectedZodiac).role;

        // Find the role on the server
        const role = guild.roles.cache.get(roleId);

        if (role) {
          try {
            // Add the role to the user
            await member.roles.add(role);

            // Send a success message to the user
            await i.editReply(`You have been assigned the ${role.name} role!`);
          } catch (error) {
            console.error(`Error assigning role: ${error}`);
            await i.editReply(`There was an error assigning the role. Please try again.`);
          }
        } else {
          // Send a message if the role doesn't exist
          await i.editReply(`The ${roleName} role does not exist.`);
        }
      });
    });
  },
};