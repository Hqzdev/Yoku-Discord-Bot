const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Sends user avatar")
    .addUserOption(option =>
      option.setName("target")
        .setDescription("The user to show the avatar of")
        .setRequired(false)
    ),

  async execute(interaction) {
    let member = interaction.member; 

    if (interaction.options.getUser("target")) {
      member = interaction.options.getUser("target");
    }

    const embed = new EmbedBuilder()
      .setColor(0x343434)
      .setTitle(`<:7824member:1268590978768441437>${member.user.username} avatar`) // Add username and ID
      .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 })); // Set image using setImage()

    await interaction.reply({ embeds: [embed] });
  },
};

