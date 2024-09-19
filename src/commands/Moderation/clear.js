const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'clear',
  description: "Clear a specified number of messages from the channel",
  /*
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  devOnly: true,
  options: [
    {
      name: 'amount',
      description: 'Number of messages to delete (1-100)',
      required: true,
      type: ApplicationCommandOptionType.Integer,
      minValue: 1,
      maxValue: 100,
    },
  ],
  callback: async (client, interaction) => {

    // Проверка прав
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:20943crossmark:1268557997349797899> | You do not have permission to use this command.');
      interaction.editReply({ embeds: [embed] });
      return;
    }

    try {
      await interaction.deferReply({ ephemeral: true });

      const amount = interaction.options.getInteger('amount');

      const deletedMessages = await interaction.channel.bulkDelete(amount, true);

      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`<:37667checkmark:1268558027364106416> | Successfully deleted **${deletedMessages.size}** messages.`);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /clear: ${error}`);
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:20943crossmark:1268557997349797899> | An error occurred while trying to clear messages.');
      interaction.editReply({ embeds: [embed] });
    }
  },
};
