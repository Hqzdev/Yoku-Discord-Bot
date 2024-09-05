const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban') 
    .setDescription('Bans a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for ban')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    const confirm = new ButtonBuilder()
      .setCustomId('confirm_ban') 
      .setLabel('Confirm Ban')
      .setStyle(ButtonStyle.Secondary);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel_ban') 
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
      .addComponents(cancel, confirm);

    const embedPrompt = new EmbedBuilder()
      .setColor('#343434')
      .setDescription(`❓ | Are you sure you want to ban ${target} for reason: **${reason}**`);

    await interaction.reply({
      embeds: [embedPrompt],
      components: [row],
    });

    const filter = i => i.user.id === interaction.user.id; 

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 }); 

    collector.on('collect', async (i) => {
      if (i.customId === 'confirm_ban') {
        const embedSuccess = new EmbedBuilder()
          .setColor('#343434')
          .setDescription(`✅ | ${target} has been banned!`);

        try {
          await interaction.guild.members.ban(target, { reason: reason });
          await i.update({ embeds: [embedSuccess], components: [] });
        } catch (error) {
          console.error(error);
          const embedError = new EmbedBuilder()
            .setColor('#343434')
            .setDescription(`❌ | Error: Could not ban ${target}.`);
          await i.update({ embeds: [embedError], components: [] });
        }
      } else if (i.customId === 'cancel_ban') {
        const embedCancel = new EmbedBuilder()
          .setColor('#343434')
          .setDescription(`❌ | Ban canceled.`);
        await i.update({ embeds: [embedCancel], components: [] });
      }
    });

    collector.on('end', collected => {
      console.log(`Collected ${collected.size} interactions.`);
    });
  },
};

