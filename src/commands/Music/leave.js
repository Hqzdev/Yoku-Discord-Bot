const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: 'leave',
  description: 'Leave the voice channel',
  callback: async (client, interaction) => {
    const connection = getVoiceConnection(interaction.guild.id);

    if (connection) {
      connection.destroy();
      interaction.reply('Left the voice channel.');
    } else {
      interaction.reply('I am not in a voice channel.');
    }
  },
};
