const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears a specified number of messages from the channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The number of messages to clear')
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    // Check if the amount is valid (between 1 and 100)
    if (amount < 1 || amount > 100) {
      const embedError = new EmbedBuilder()
        .setColor('#343434')
        .setDescription(`<:20943crossmark:1268557997349797899> | Invalid amount. Please enter a number between 1 and 100.`);
      await interaction.reply({ embeds: [embedError], ephemeral: true });
      return;
    }

    // Fetch messages from the channel
    try {
      const messages = await interaction.channel.messages.fetch({ limit: amount });

      // Delete the messages
      await interaction.channel.bulkDelete(messages);

      // Send a confirmation message
      const embedSuccess = new EmbedBuilder()
        .setColor('#343434')
        .setDescription(`<:37667checkmark:1268558027364106416> | ${amount} messages have been cleared.`);
      await interaction.reply({ embeds: [embedSuccess], ephemeral: true });
    } catch (error) {
      console.error(error);
      const embedError = new EmbedBuilder()
        .setColor('#343434')
        .setDescription(`<:20943crossmark:1268557997349797899> | Error: Could not clear messages.`);
      await interaction.reply({ embeds: [embedError], ephemeral: true });
    }
  },
};

