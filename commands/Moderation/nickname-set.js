const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('change-name')
    .setDescription('Change name member')
    .addUserOption(option => 
      option.setName('member')
        .setDescription('Set member')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('nickname')
        .setDescription('Write a new nick')
        .setRequired(true)),

  async execute(interaction) {
    const member = interaction.options.getMember('member');
    const newNickname = interaction.options.getString('nickname');

    if (!member) {
      return interaction.reply({ content: '<:20943crossmark:1268557997349797899>Member is not find', ephemeral: true });
    }

    try {
      await member.setNickname(newNickname); 
      
      const embed = new EmbedBuilder()
        .setColor(0x343434)
        .setTitle('<:37667checkmark:1268558027364106416>Nickname succesfully changed')
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '<:20943crossmark:1268557997349797899>An error occurred while trying to change the nickname.', ephemeral: true });
    }
  },
};

