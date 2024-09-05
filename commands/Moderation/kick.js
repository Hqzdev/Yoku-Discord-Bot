const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick') 
    .setDescription('Kicks a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for kick')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    const confirm = new ButtonBuilder()
      .setCustomId('confirm_kick') // Используйте уникальный ID для подтверждения
      .setLabel('Confirm')
      .setStyle(ButtonStyle.Secondary);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel_kick') // Используйте уникальный ID для отмены
      .setLabel('Cancel')
      .setEmoji('<:Deleted:1011988643889565746>')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
      .addComponents(cancel, confirm);

      const embedPrompt = new EmbedBuilder()
      .setColor('#343434')
      .setDescription(`❓ | Are you sure you want to kick ${target} for reason: **${reason}**`);

    const filter = i => i.user.id === interaction.user.id; 

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 }); 

    collector.on('collect', async (i) => {
      if (i.customId === 'confirm_kick') {
       
        try {
          await interaction.guild.members.ban(target, { reason: reason });
          await i.update({ embeds: [embedSuccess], components: [] });
        } catch (error) {
          console.error(error);
          const embedError = new EmbedBuilder()
            .setColor('#343434')
            .setDescription(`❌ | Error: Could not kick ${target}.`);
          await i.update({ embeds: [embedError], components: [] });
        }
      } else if (i.customId === 'cancel_kick') {
        const embedCancel = new EmbedBuilder()
          .setColor('#343434')
          .setDescription(`❌ | Kick canceled.`);
        await i.update({ embeds: [embedCancel], components: [] });
      }
    });

    collector.on('end', collected => {
      console.log(`Collected ${collected.size} interactions.`);
    });
  },
};

