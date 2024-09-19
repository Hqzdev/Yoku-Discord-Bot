const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  name: 'join',
  description: 'Join the voice channel',
  callback: async (client, interaction) => {
    const channel = interaction.member.voice.channel;
    
    if (!channel) {
      return interaction.reply('You need to join a voice channel first!');
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    interaction.reply('Joined the voice channel!');
  },
};
