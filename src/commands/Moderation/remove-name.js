const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-name')
    .setDescription('remove name member')
    .addUserOption(option => 
      option.setName('member')
        .setDescription('Set member')
        .setRequired(true)),

  async execute(interaction) {
    const member = interaction.options.getMember('member');

    if (!member) {
      return interaction.reply({ content: '<:20943crossmark:1268557997349797899>Member not found', ephemeral: true });
    }

    async function removeNickname(member) {
      try {
        await member.setNickname(null);

        const embed = new EmbedBuilder()
          .setColor(0x343434)
          .setTitle('<:37667checkmark:1268558027364106416>Nickname successfully removed')
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: '<:20943crossmark:1268557997349797899>An error occurred while trying to remove the nickname.', ephemeral: true });
      }
    }

    // Вызов функции удаления ника
    removeNickname(member);
  },
};
